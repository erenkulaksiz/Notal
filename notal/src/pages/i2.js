import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, Switch, useTheme, Tooltip, Input, Avatar } from '@nextui-org/react';
import cookie from 'js-cookie';
import { useTheme as useNextTheme } from 'next-themes';
import styled from 'styled-components'

import styles from '../../styles/App.module.scss';
import { server } from '../config';

import UserIcon from '../../public/icons/user.svg';
import DashboardIcon from '../../public/icons/dashboard.svg';
import StarOutlineIcon from '../../public/icons/star_outline.svg';
import StarFilledIcon from '../../public/icons/star_filled.svg';
import AddIcon from '../../public/icons/add.svg';
import CrossIcon from '../../public/icons/cross.svg';
import CheckIcon from '../../public/icons/check.svg';
import DeleteIcon from '../../public/icons/delete.svg';
import QuestionIcon from '../../public/icons/question.svg';
import SyncIcon from '../../public/icons/sync.svg';
import DarkIcon from '../../public/icons/dark.svg';
import LightIcon from '../../public/icons/light.svg';
import LogoutIcon from '../../public/icons/logout.svg';

import { withAuth, withCheckUser } from '../hooks/route';
import useAuth from '../hooks/auth';
import { CheckToken } from '../utils';

const Details = styled.details`
  position: relative;
  display: inline-block;
  background-color: transparent;
  &[open] > summary:before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
  }
`

const Home = (props) => {
  const auth = useAuth();
  const router = useRouter();
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  return (<Container xl>
    <Head>
      <title>Home · Notal</title>
      <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div style={{ borderRadius: 0, padding: 12, paddingTop: 18 }}>
      <Grid.Container justify="center">
        <Grid xs={4} alignItems='center'></Grid>
        <Grid xs={4} justify='center' alignItems='center'>
          <img
            src={isDark ? "./icon_white.png" : "./icon_galactic.png"}
            alt="Michael Scott"
            style={{ maxHeight: "100%", width: 160, }}
          />
        </Grid>
        <Grid xs={4} justify='flex-end' alignItems='center'>
          <Switch
            color="primary"
            initialChecked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            css={{ mr: 12 }}
          />
          <Details style={{
            position: "relative",
            display: "inline-block",
            backgroundColor: "transparent"
          }}>
            <summary style={{
              userSelect: "none",
              "&::-webkit-details-market": {
                display: "none",
              }
            }}>
              <Avatar size="md" src="https://firebasestorage.googleapis.com/v0/b/notal-1df19.appspot.com/o/avatars%2FHLzWAqIj7MMqbOoUV7uFShWdmvN2?alt=media&token=26527a55-5d8f-4b8a-9808-f56ad2dc37ff" />
            </summary>
            <Card css={{ zIndex: 2, position: "absolute", right: 0, top: "100%", width: "auto" }}>
              <Text h4>Eren Kulaksiz</Text>
              <Text span>erenkulaksz@gmail.com</Text>
              <Button
                icon={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => { }}
                css={{ mt: 12 }}
                size="md"
                color="gradient"
              >
                Profile
              </Button>
              <Button
                icon={<LogoutIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => { }}
                css={{ mt: 8, }}
                size="md"
                color="gradient"
              >
                Sign Out
              </Button>
            </Card>
          </Details>
        </Grid>
      </Grid.Container>
    </div>
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} sm={2} md={2} css={{ fd: "column" }}>
        <Button
          icon={<DashboardIcon height={24} width={24} style={{ fill: "currentColor" }} />}
          onClick={() => { }}
          css={{ minWidth: "100%" }}
        >
          Workspaces
        </Button>
        <Spacer y={1} />
        <Button
          icon={<StarFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
          onClick={() => { }}
          css={{ minWidth: "100%" }}
          light
        >
          Favorites
        </Button>
      </Grid>
      <Grid xs={12} sm={10} md={10}>
        <Text h1>Asdas</Text>
      </Grid>
    </Grid.Container>
  </Container>
  )
}

export default withCheckUser(withAuth(Home));