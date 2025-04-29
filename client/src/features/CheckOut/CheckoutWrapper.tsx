
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import agent from "../../app/api/agent"
import { setBasket } from "../Basket/BasketSlice"
import LoadingComponent from "../../app/layout/LoadingComponent"
import CheckoutStepper from "./CheckoutStepper"
import { useEffect, useState } from "react"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutWrapper() {
  const dispatch = useAppDispatch()
  const { basket } = useAppSelector((state) => state.basket)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agent.Payments.createPaymentIntent()
        .then(basket => {
            dispatch(setBasket(basket.data))
        })
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
}, [dispatch])

  if (loading ) {
    return <LoadingComponent message="Loading checkout ....." />
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: basket?.clientSecret }}>
      <CheckoutStepper />
    </Elements>
  )
}
