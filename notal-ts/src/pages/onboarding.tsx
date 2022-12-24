import Head from "next/head";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

import { CheckIcon, HomeFilledIcon } from "@icons";
import { useAuth, useNotalUI } from "@hooks";
import { Button, Container, Layout, LoadingOverlay, Tab } from "@components";
import { CurrentPageViewer } from "@components/Onboarding";
import { ValidateToken } from "@utils/api/validateToken";
import { server } from "@utils";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";
import type { NotalRootProps } from "@types";
import type { GetServerSidePropsContext } from "next";

const OnboardingPage = {
  Welcome: dynamic<any>(() =>
    import("../components/Onboarding").then((mod) => mod.Welcome)
  ),
  CreateWorkspace: dynamic<any>(() =>
    import("../components/Onboarding").then((mod) => mod.CreateWorkspace)
  ),
  Workspace: dynamic<any>(() =>
    import("../components/Onboarding").then((mod) => mod.Workspace)
  ),
};

function Onboarding(props: NotalRootProps) {
  const router = useRouter();
  const NotalUI = useNotalUI();
  const firebaseAuth = getAuth();
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState(0);

  const OnboardingPages = [
    <OnboardingPage.Welcome key="onboardingPageWelcome" />,
    <OnboardingPage.CreateWorkspace
      key="onboardingPageCreateWorkspace"
      onCreate={() => setCurrentPage(currentPage + 1)} // On workspace create, go to next page
    />,
    <OnboardingPage.Workspace
      key="onboardingPageWorkspace"
      validate={props.validate}
    />,
  ];

  async function finishOnboarding() {
    const token = await firebaseAuth.currentUser?.getIdToken();
    const data = await fetch(`${server}/api/onboarding/complete`, {
      headers: new Headers({
        "content-type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      }),
      method: "POST",
      body: JSON.stringify({ uid: auth?.validatedUser?.uid, token }),
    })
      .then((response) => response.json())
      .catch((error) => {
        return { error, success: false };
      });
    if (data.success) {
      NotalUI.Alert.show({
        title: (
          <div className="flex flex-row gap-2 items-center">
            <CheckIcon size={24} fill="currentColor" />
            <span>Onboarding complete</span>
          </div>
        ),
        desc: "You have successfully completed the onboarding. We hope that you enjoy using Notal!",
        showCloseButton: false,
        notCloseable: false,
        buttons: [
          <div className="w-full flex justify-end" key="btn0">
            <Button
              onClick={() => {
                router.push("/");
                NotalUI.Alert.close();
              }}
              gradient
            >
              <HomeFilledIcon size={24} fill="currentColor" />
              <span className="ml-1">Home</span>
            </Button>
          </div>,
        ],
      });
      return;
    }
    NotalUI.Alert.show({
      title: "Error",
      desc: data?.error,
      showCloseButton: true,
      notCloseable: false,
    });
  }

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Layout {...props}>
        <Head>
          <title>Onboarding · notal.app</title>
        </Head>
        <div className="flex flex-col h-full max-w-full justify-between py-6 px-4">
          <Tab // Uses my own tab component!
            selected={currentPage}
            onSelect={(index) => setCurrentPage(index)}
            id="onboardingTab"
            globalTabViewClassName="pt-2 pb-2"
            className="h-full"
            headerVisible={false}
            animated
          >
            {OnboardingPages.map((page) => (
              <Tab.TabView key={page.key} title={page.props.title}>
                {page}
              </Tab.TabView>
            ))}
          </Tab>
          <div className="w-full flex flex-col gap-4">
            <CurrentPageViewer
              pages={OnboardingPages.length}
              currentPage={currentPage}
            />
            <div className="flex flex-row w-full justify-end gap-2">
              <div className="w-1/2"></div>
              {OnboardingPages.length != currentPage + 1 && currentPage != 1 && (
                <Button
                  size="sm:h-8 h-12"
                  fullWidth="w-1/2"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              )}
              {OnboardingPages.length == currentPage + 1 && (
                <Button
                  size="sm:h-8 h-12"
                  fullWidth="w-1/2"
                  onClick={() => finishOnboarding()}
                  gradient
                >
                  Finish
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
}

export default Onboarding;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) validate = await ValidateToken({ token: ctx.req.cookies.auth });
  if (
    // redirect if user already took onboarding or is not logged in
    !validate ||
    !validate.success ||
    (validate.data && validate.data?.onboarding?.completed)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { validate } };
}
