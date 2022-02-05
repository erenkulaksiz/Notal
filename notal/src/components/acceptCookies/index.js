import { Button, Text, Card, Link as ALink } from '@nextui-org/react';

const AcceptCookies = ({ visible, onAccept, style }) => {
    if (!visible) return null;

    return (
        <div style={{ position: "sticky", bottom: 16, left: 16, zIndex: 500, display: "flex", alignItems: "flex-start", maxWidth: 300, ...style }}>
            <Card css={{ width: "auto" }}>
                <Text>{'We use cookies to authenticate, analyze traffic and show personalized content. By clicking "Accept Cookies" or continuing using this website you accept our use of cookies.'}</Text>
                <Button size="md" css={{ mt: 8 }} onClick={onAccept}>Accept Cookies</Button>
            </Card>
        </div>
    )
}

export default AcceptCookies