
import { Box, Button, Card, CardContent, CssBaseline, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2"
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded"
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded"
import Info from "./Info"
import InfoMobile from "./InfoMobile"
import PaymentForm from "./PaymentForm"
import Review from "./Review"
import SitemarkIcon from "./SitemarkIcon"
import AddressForm from "./AddressForm‎"
import { type FieldValues, FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { valiadtionScheme } from "./checkoutValidation"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import agent from "../../app/api/agent"
import { clearBasket } from "../Basket/BasketSlice"
import { LoadingButton } from "@mui/lab"
import { useEffect, useState } from "react"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const steps = ["Shipping address", "Payment details", "Review your order"]

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0)
  const [orderNumber, setOrdernumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState("")
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false)
  const dispatch = useAppDispatch()
  const { basket } = useAppSelector((state) => state.basket)
  const stripe = useStripe()
  const elements = useElements()

  const subtotal = basket?.items?.reduce((amount, item) => Number(item.price * item.quantity) + amount, 0) ?? 0
  const deliveryFee = subtotal > 100 ? 0 : 2

  const currentCalidationScheme = valiadtionScheme[activeStep]

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentCalidationScheme),
  })

  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({ ...methods.getValues(), ...response.data, saveAddress: false })
      }
    })
  }, [methods])

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />
      case 1:
        return <PaymentForm />
      case 2:
        return (
          <Review
            orderNumber={orderNumber}
            paymentSucceeded={paymentSucceeded}
          />
        )
      default:
        throw new Error("Unknown step")
    }
  }

  async function submitOrder(data: FieldValues) {
    if (!stripe || !elements) {
      Swal.fire({
        icon: "error",
        title: "نظام الدفع غير جاهز",
        text: "الرجاء الانتظار حتى يكتمل تحميل نظام الدفع",
      })
      return
    }

    setLoading(true)
    const { saveAddress, ...shippingAddress } = data

    try {
      // Step 1: Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/order-confirmation",
        },
        redirect: "if_required",
      })

      if (stripeError) {
        setLoading(false)
        Swal.fire({
          icon: "error",
          title: "فشل في الدفع",
          text: stripeError.message || "حدث خطأ أثناء محاولة الدفع",
        })
        setPaymentMessage(stripeError.message || "Payment failed")
        setPaymentSucceeded(false)
        return
      }

      // Step 2: Create order
      const response = await agent.Orders.create({
        saveAddress,
        shippingAddress,
      })

      if (response.success) {
        setOrdernumber(response.data.id)
        setPaymentSucceeded(true)
        dispatch(clearBasket())

        // Show success message
        Swal.fire({
          icon: "success",
          title: "تم الدفع بنجاح!",
          text: "شكراً لك، تمت عملية الدفع بنجاح",
          confirmButtonText: "مراجعة الطلب",
        }).then(() => {
          // This code runs after the user clicks "مراجعة الطلب"
          setLoading(false)
          setActiveStep(2) // Go to review step (index 2)
          setPaymentSucceeded(true)
        })
      } else {
        setLoading(false)
        Swal.fire({
          icon: "error",
          title: "فشل في إنشاء الطلب",
          text: "حدث خطأ أثناء محاولة إنشاء الطلب",
        })
        setPaymentMessage("Failed to create order")
        setPaymentSucceeded(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Checkout error:", error)
      Swal.fire({
        icon: "error",
        title: "خطأ في الدفع",
        text: "حدث خطأ غير متوقع أثناء عملية الدفع",
      })
      setPaymentMessage("An error occurred during checkout")
      setPaymentSucceeded(false)
    }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === 1) {
      await submitOrder(data)
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  function submitDisabled(): boolean {
    if (activeStep === steps.length - 1) {
      return !methods.formState.isValid || !stripe || !elements
    } else {
      return !methods.formState.isValid
    }
  }

  const handleViewOrder = () => {
    window.location.href = `/order/${orderNumber}`
  }

  const handleGoToOrders = () => {
    window.location.href = "/order"
  }

  if (loading && isCheckoutComplete) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          جاري تحضير صفحة التأكيد...
        </Typography>
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <CssBaseline enableColorScheme />
      <Grid
        container
        sx={{
          height: {
            xs: "100%",
            sm: "calc(100dvh - var(--template-frame-height, 0px))",
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ xs: 12, sm: 5, lg: 4 }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 16,
            px: "2% !important",
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            {(activeStep === 0 || activeStep === 1) && <Info />}
          </Box>
        </Grid>
        <Grid
          size={{ sm: 12, md: 7, lg: 8 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
              }}
            >
              <Stepper id="desktop-stepper" activeStep={activeStep} sx={{ width: "100%", height: 40 }}>
                {steps.map((label) => (
                  <Step sx={{ ":first-of-type": { pl: 0 }, ":last-child": { pr: 0 } }} key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2 ? (subtotal + deliveryFee).toFixed(2) : subtotal.toFixed(2)}
                </Typography>
              </div>
              <InfoMobile />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-child": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length - 1 ? (
              <Stack spacing={2} useFlexGap>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    backgroundColor: "success.light",
                    color: "success.contrastText",
                    borderRadius: 2,
                    p: 3,
                    mb: 2,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5">تم الدفع بنجاح!</Typography>
                </Box>

                {paymentSucceeded ? (
                  <>
                    <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                      رقم طلبك هو
                      <strong>&nbsp;# {orderNumber} </strong>. لقد أرسلنا تأكيد طلبك عبر البريد الإلكتروني وسنقوم
                      بتحديثك بمجرد شحنه.
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingBagIcon />}
                      onClick={handleViewOrder}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      عرض تفاصيل الطلب
                    </Button>

                    <Button variant="outlined" onClick={handleGoToOrders} sx={{ mt: 1 }} fullWidth>
                      الذهاب إلى طلباتي
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" onClick={handleBack}>
                    الرجوع والمحاولة مرة أخرى
                  </Button>
                )}
              </Stack>
            ) : (
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <Box
                  sx={[
                    {
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: "end",
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: "60px",
                    },
                    activeStep !== 0 ? { justifyContent: "space-between" } : { justifyContent: "flex-end" },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{ display: { xs: "flex", sm: "none" } }}
                    >
                      Previous
                    </Button>
                  )}
                  <LoadingButton
                    loading={loading}
                    disabled={submitDisabled()}
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    type="submit"
                    sx={{ width: { xs: "100%", sm: "fit-content" } }}
                  >
                    {activeStep === 1 ? "Place order" : "Next"}
                  </LoadingButton>
                </Box>
              </form>
            )}
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
