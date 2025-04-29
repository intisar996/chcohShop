
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAppDispatch } from "../../store/configureStore";
import { GoogleSignIn } from "../../features/Account/accountSlice";
import { useNavigate } from "react-router-dom";




export default function GoogleOAuth() {

    const dispacth = useAppDispatch();
    const navigate = useNavigate();

    async function handleLoginSuccess(response :any) {
        try {
            const token = response.credential;

            console.log("token Id", token);
            await dispacth(GoogleSignIn(token))
            navigate(location.state?.from || '/product');

        } catch(error) {
            console.log(error);

        }
    }
    const handleLoginError = () => {
        console.error("Login Failed");
        alert("Login Failed");
    };



    return (

        <GoogleOAuthProvider clientId="205879884306-ij2euidu0h5ou5ibgrd4rq08bpv1muo2.apps.googleusercontent.com">
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                />
            </div>
        </GoogleOAuthProvider>
    );
}