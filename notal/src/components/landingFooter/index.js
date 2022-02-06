import { Spacer, Text, Card, useTheme, Row, Link as ALink, Grid } from '@nextui-org/react';
import Link from 'next/link';
import PoweredByVercel from 'powered-by-vercel';
import styled from 'styled-components';

import {
    CodeIcon,
    HeartIcon
} from '../../icons';

const Footer = styled.footer`
    background-color: ${props => props.isDark ? "#0a0a0a" : "#f2f2f2"};
    padding-top: 24px;
    padding-bottom: 24px;
`;

const LandingFooter = () => {
    const { isDark } = useTheme();

    return (<Footer isDark={isDark}>
        <Grid.Container>
            <Grid xs={2} md={4}></Grid>
            <Grid xs={8} md={4}>
                <Row css={{ alignItems: "center", justifyContent: "center" }}>
                    <CodeIcon size={20} fill="currentColor" style={{ marginRight: 4, transform: "scale(0.8)" }} />
                    <Text>with</Text>
                    <HeartIcon size={20} fill="red" style={{ marginLeft: 4, marginRight: 4, transform: "scale(0.8)" }} />
                    <Text css={{ mr: 8 }}>by</Text>
                    <Link href="https://github.com/erenkulaksiz" passHref>
                        <ALink color>@Eren Kulaksiz</ALink>
                    </Link>
                </Row>
            </Grid>
            <Grid xs={2} md={4}></Grid>
            <Spacer y={1} />
            <Grid xs={12} justify="center">
                <PoweredByVercel utmSource="notal" />
            </Grid>
        </Grid.Container>
    </Footer>)
}

export default LandingFooter;