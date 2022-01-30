import cookie from "js-cookie";
//import { server } from '../config';

export const CheckToken = async ({ token, props }) => {
    //console.log("jwtyi kontrol edicem bi canım");
    if (props.validate?.error == "auth/id-token-expired" || props.validate?.error == "auth/argument-error") {
        try {
            /*
            console.log("Checktoken !!! ", token.res);
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: token.res }),
            }).then(response => response.json()).catch(error => {
                return { success: false, ...error }
            });
            console.log("data validate: ", dataValidate);
            */
            await cookie.set("auth", token.res, { expires: 1 });
            return true
        } catch (err) {
            console.error(err);
            auth.users.logout();
            return false
        }
    } else {
        return false;
    }
};