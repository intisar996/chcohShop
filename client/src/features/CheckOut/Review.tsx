
import { Typography, Stack, Divider, Box, Button } from "@mui/material"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

interface ReviewProps {
  orderNumber: number
  paymentSucceeded: boolean
}

export default function Review({ orderNumber, paymentSucceeded }: ReviewProps) {
  const handleViewOrder = () => {
    window.location.href = `/order/${orderNumber}`
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" gutterBottom>
        تأكيد الطلب
      </Typography>

      {paymentSucceeded && (
        <>
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
            <Typography variant="h6" gutterBottom>
              تم الدفع بنجاح!
            </Typography>
            <Typography variant="subtitle1">رقم طلبك: #{orderNumber}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.
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
        </>
      )}

      {!paymentSucceeded && <Typography color="error">حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى.</Typography>}
    </Stack>
  )
}
