import { useEffect } from "react";
import Head from "next/head";

import { ValidateToken } from "@utils/api/validateToken";
import { SecureIcon } from "@icons";
import { Navbar, Footer, Layout, Container } from "@components";
import type { NotalRootProps } from "@types";
import { useWorkspace } from "@hooks";
import { server } from "@utils";
import { CONSTANTS } from "@constants";
import type { GetServerSidePropsContext } from "next";
import type { ValidateTokenReturnType } from "@utils/api/validateToken";

export function PrivacyPolicy(props: NotalRootProps) {
  const { setWorkspace } = useWorkspace();

  useEffect(() => {
    setWorkspace(null);
  }, []);

  return (
    <Layout {...props}>
      <Head>
        <title>Privacy Policy · notal.app</title>
        <meta
          property="twitter:description"
          name="twitter:description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="og:description"
          name="og:description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="description"
          name="description"
          content={CONSTANTS.SEO_DESCRIPTION}
        />
        <meta
          property="twitter:image"
          name="twitter:image"
          content={`${server}/icon_big.png`}
        />
        <meta
          property="og:image"
          name="og:image"
          content={`${server}/icon_big.png`}
        />
        <meta
          property="apple-mobile-web-app-title"
          name="apple-mobile-web-app-title"
          content={CONSTANTS.APP_NAME}
        />
        <meta
          property="twitter:title"
          name="twitter:title"
          content={CONSTANTS.APP_NAME}
        />
        <meta
          property="og:title"
          name="og:title"
          content={CONSTANTS.APP_NAME}
        />
        <meta property="og:url" content={`${server}/privacy-policy`} />
      </Head>
      <Navbar />
      <Container>
        <div className="text-3xl font-medium flex flex-row items-center border-b-2 border-neutral-800 pb-2">
          <SecureIcon
            size={24}
            fill="currentColor"
            style={{ transform: "scale(1.4)" }}
            className="mr-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-2 items-end">
            <h1 className="flex flex-row items-end text-black dark:text-white">
              Privacy Policy
            </h1>
            <h1 className="text-sm text-neutral-400">
              Last Updated: 11 March, 2022
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4 text-neutral-700 dark:text-neutral-300">
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </div>
        <h1 className="mt-8 text-3xl font-medium border-b-2 border-neutral-800 pb-2">
          Interpretation and Definitions
        </h1>
        <div className="grid grid-cols-1 gap-4 mt-4 text-neutral-700 dark:text-neutral-300">
          <p>
            <h1 className="text-xl mb-1 text-black dark:text-white">
              Interpretation
            </h1>
            <p>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </p>
          </p>
          <p>
            <h2 className="text-xl dark:text-white text-black">Definitions</h2>
            <p className="mt-2">For the purposes of this Privacy Policy:</p>
            <ul className="list-disc mt-4 grid grid-cols-1 gap-4 text-sm pl-4">
              <li>
                Account means a unique account created for You to access our
                Service or parts of our Service.
              </li>
              <li>
                Cookies are small files that are placed on Your computer, mobile
                device or any other device by a website, containing the details
                of Your browsing history on that website among its many uses.
              </li>
              <li>Country refers to: Turkey</li>
              <li>
                Device means any device that can access the Service such as a
                computer, a cellphone or a digital tablet.
              </li>
              <li>
                Personal Data is any information that relates to an identified
                or identifiable individual.
              </li>
              <li>Service refers to the Website.</li>
              <li>
                Service Provider means any natural or legal person who processes
                the data on behalf of the Company. It refers to third-party
                companies or individuals employed by the Company to facilitate
                the Service, to provide the Service on behalf of the Company, to
                perform services related to the Service or to assist the Company
                in analyzing how the Service is used.
              </li>
              <li>
                Third-party Social Media Service refers to any website or any
                social network website through which a User can log in or create
                an account to use the Service.
              </li>
              <li>
                Usage Data refers to data collected automatically, either
                generated by the use of the Service or from the Service
                infrastructure itself (for example, the duration of a page
                visit).
              </li>
              <li>
                Website refers to Notal, accessible from{" "}
                <a href="https://notal.app" className="text-blue-600">
                  https://notal.app
                </a>
              </li>
              <li>
                You means the individual accessing or using the Service, or the
                company, or other legal entity on behalf of which such
                individual is accessing or using the Service, as applicable.
              </li>
            </ul>
          </p>
          <h1 className="text-xl border-b-2 border-neutral-800 pb-2 mt-4 dark:text-white text-black">
            Collecting and Using Your Personal Data
          </h1>
          <h1 className="text-lg pb-2">Types of Data Collected</h1>
          <h1 className="text-md pb-2">Personal Data</h1>
          <p className="text-neutral-700 dark:text-neutral-300">
            While using Our Service, We may ask You to provide Us with certain
            personally identifiable information that can be used to contact or
            identify You. Personally identifiable information may include, but
            is not limited to:
          </p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Usage Data</li>
          </ul>
          <h1 className="text-xl pb-2 mt-4 dark:text-white text-black">
            Usage Data
          </h1>
          <p>Usage Data is collected automatically when using the Service.</p>
          <p>
            {
              "Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data."
            }
          </p>
          <p>
            When You access the Service by or through a mobile device, We may
            collect certain information automatically, including, but not
            limited to, the type of mobile device You use, Your mobile device
            unique ID, the IP address of Your mobile device, Your mobile
            operating system, the type of mobile Internet browser You use,
            unique device identifiers and other diagnostic data.
          </p>
          <p>
            We may also collect information that Your browser sends whenever You
            visit our Service or when You access the Service by or through a
            mobile device.
          </p>
          <h1 className="text-xl dark:text-white text-black">
            Information from Third-Party Social Media Services
          </h1>
          <p>
            The Company(s) allows You to create an account and log in to use the
            Service through the following Third-party Social Media Services:
          </p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>Google</li>
            <li>GitHub</li>
          </ul>
          <p>
            {
              "If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account."
            }
          </p>
          <p>
            {
              "You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy."
            }
          </p>
          <h1 className="text-xl dark:text-white text-black">
            Tracking Technologies and Cookies
          </h1>
          <p>
            We use Cookies and similar tracking technologies to track the
            activity on Our Service and store certain information. Tracking
            technologies used are beacons, tags, and scripts to collect and
            track information and to improve and analyze Our Service. The
            technologies We use may include:
          </p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>
              Cookies or Browser Cookies. A cookie is a small file placed on
              Your Device. You can instruct Your browser to refuse all Cookies
              or to indicate when a Cookie is being sent. However, if You do not
              accept Cookies, You may not be able to use some parts of our
              Service. Unless you have adjusted Your browser setting so that it
              will refuse Cookies, our Service may use Cookies.
            </li>
          </ul>
          <p>
            {
              "Cookies can be 'Persistent' or 'Session' Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser."
            }
          </p>
          <p>
            For more information about the cookies we use and your choices
            regarding cookies, please visit our Cookies Policy or the Cookies
            section of our Privacy Policy.
          </p>
          <h1 className="text-xl dark:text-white text-black">
            Use of Your Personal Data
          </h1>
          <p>The Company may use Personal Data for the following purposes:</p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>
              To provide and maintain our Service, including to monitor the
              usage of our Service.
            </li>
            <li>
              To manage Your Account: to manage Your registration as a user of
              the Service. The Personal Data You provide can give You access to
              different functionalities of the Service that are available to You
              as a registered user.
            </li>
            <li>
              {
                "To contact You: To contact You by email, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation."
              }
            </li>
            <li>
              To provide You with news, special offers and general information
              about other goods, services and events which we offer that are
              similar to those that you have already purchased or enquired about
              unless You have opted not to receive such information.
            </li>
            <li>
              For other purposes: We may use Your information for other
              purposes, such as data analysis, identifying usage trends,
              determining the effectiveness of our promotional campaigns and to
              evaluate and improve our Service, products, services, marketing
              and your experience.
            </li>
          </ul>
          <p>
            We may share Your personal information in the following situations:
          </p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>
              With Service Providers: We may share Your personal information
              with Service Providers to monitor and analyze the use of our
              Service, to contact You.
            </li>
            <li>
              For business transfers: We may share or transfer Your personal
              information in connection with, or during negotiations of, any
              merger, sale of Company assets, financing, or acquisition of all
              or a portion of Our business to another company.
            </li>
            <li>
              With Affiliates: We may share Your information with Our
              affiliates, in which case we will require those affiliates to
              honor this Privacy Policy. Affiliates include Our parent company
              and any other subsidiaries, joint venture partners or other
              companies that We control or that are under common control with
              Us.
            </li>
            <li>
              With other users: when You share personal information or otherwise
              interact in the public areas with other users, such information
              may be viewed by all users and may be publicly distributed
              outside. If You interact with other users or register through a
              Third-Party Social Media Service, Your contacts on the Third-Party
              Social Media Service may see Your name, profile, pictures and
              description of Your activity. Similarly, other users will be able
              to view descriptions of Your activity, communicate with You and
              view Your profile.
            </li>
            <li>
              With Your consent: We may disclose Your personal information for
              any other purpose with Your consent.
            </li>
          </ul>
          <h1 className="text-xl dark:text-white text-black">
            Retention of Your Personal Data
          </h1>
          <p>
            The Company will retain Your Personal Data only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use Your Personal Data to the extent necessary to comply
            with our legal obligations (for example, if we are required to
            retain your data to comply with applicable laws), resolve disputes,
            and enforce our legal agreements and policies.
          </p>
          <p>
            The Company will also retain Usage Data for internal analysis
            purposes. Usage Data is generally retained for a shorter period of
            time, except when this data is used to strengthen the security or to
            improve the functionality of Our Service, or We are legally
            obligated to retain this data for longer time periods.
          </p>
          <h1 className="text-xl dark:text-white text-black">
            Disclosure of Your Personal Data
          </h1>
          <h1 className="text-md dark:text-white text-black">
            Business Transactions
          </h1>
          <p>
            If the Company is involved in a merger, acquisition or asset sale,
            Your Personal Data may be transferred. We will provide notice before
            Your Personal Data is transferred and becomes subject to a different
            Privacy Policy.
          </p>
          <h1 className="text-md dark:text-white text-black">
            Law enforcement
          </h1>
          <p>
            Under certain circumstances, the Company may be required to disclose
            Your Personal Data if required to do so by law or in response to
            valid requests by public authorities (e.g. a court or a government
            agency).
          </p>
          <h1 className="text-md dark:text-white text-black">
            Other legal requirements
          </h1>
          <p>
            The Company may disclose Your Personal Data in the good faith belief
            that such action is necessary to:
          </p>
          <ul className="list-disc grid grid-cols-1 gap-4 text-sm pl-4">
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of the Company</li>
            <li>
              Prevent or investigate possible wrongdoing in connection with the
              Service
            </li>
            <li>
              Protect the personal safety of Users of the Service or the public
            </li>
            <li>Protect against legal liability</li>
          </ul>
          <h1 className="text-md dark:text-white text-black">
            Security of Your Personal Data
          </h1>
          <p>
            The security of Your Personal Data is important to Us, but remember
            that no method of transmission over the Internet, or method of
            electronic storage is 100% secure. While We strive to use
            commercially acceptable means to protect Your Personal Data, We
            cannot guarantee its absolute security.
          </p>
          <h1 className="text-md dark:text-white text-black">
            {"Children's Privacy"}
          </h1>
          <p>
            Our Service does not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 13. If You are a parent or guardian and You are
            aware that Your child has provided Us with Personal Data, please
            contact Us. If We become aware that We have collected Personal Data
            from anyone under the age of 13 without verification of parental
            consent, We take steps to remove that information from Our servers.
          </p>
          <p>
            {
              "If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information."
            }
          </p>
          <h1 className="text-md dark:text-white text-black">
            Links to Other Websites
          </h1>
          <p>
            {
              "Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit."
            }
          </p>
          <p>
            We have no control over and assume no responsibility for the
            content, privacy policies or practices of any third party sites or
            services.
          </p>
          <h1 className="text-2xl font-semibold dark:text-white text-black border-b-2 border-neutral-800 pb-2">
            Changes to this Privacy Policy
          </h1>
          <p>
            We may update Our Privacy Policy from time to time. We will notify
            You of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            {
              "We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the 'Last Updated' date at the top of this Privacy Policy."
            }
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
          <h2 className="text-md font-semibold dark:text-white text-black">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us:
          </p>
          <div className="text-blue-700 flex flex-col">
            <a href="mailto:erenkulaksz@gmail.com">erenkulaksz@gmail.com</a>
            <a
              href="https://twitter.com/notalapp"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700"
            >
              twitter.com/notalapp
            </a>
          </div>
        </div>
        <Footer className="pt-4" />
      </Container>
    </Layout>
  );
}

export default PrivacyPolicy;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let validate = {} as ValidateTokenReturnType;
  if (ctx.req) validate = await ValidateToken({ token: ctx.req.cookies.auth });
  return { props: { validate } };
}
