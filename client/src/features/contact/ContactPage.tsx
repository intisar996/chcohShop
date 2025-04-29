import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { decrement, increment } from "./CounterSlices";

export default function ContactPage()
{
    const dispatch = useAppDispatch();
    const { data,title } = useAppSelector(state => state.counter);

    return (

        <>
            <Typography variant='h1'>

                {data}
                {title}
                


            </Typography>

            <ButtonGroup>
                <Button onClick={() => dispatch(decrement(1))}  variant='contained' color='error'>Decrement</Button>
                <Button onClick={() => dispatch(increment(1))} variant='contained' color='error'>INcrement</Button>
                <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>add 5</Button>

            </ButtonGroup>
        </>
    )
}