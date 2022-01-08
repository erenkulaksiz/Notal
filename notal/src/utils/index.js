import cookie from "js-cookie";

export const CheckToken = async ({ auth, router, props }) => {
    console.log("jwtyi kontrol edicem bi canım");

    if (props.validate?.error == "auth/id-token-expired" || props.validate?.error == "auth/argument-error") {
        try {
            const { token } = await auth.users.getIdToken();
            console.log("token: ", token);
            await cookie.set("auth", token, { expires: 1 });
            router.replace(router.asPath);
            return true
        } catch (err) {
            console.error(err);
            auth.users.logout();
            return false
        }
    } else {
        console.log("kontrol ettim sorun yok kralsın");
    }
};