import { CONSTANTS } from "@constants/index";
import { NotalRootProps } from "@types";
import { server } from "@utils";

export function WorkspaceSEO({
  workspace,
}: {
  workspace: NotalRootProps["workspace"];
}) {
  return (
    <>
      <meta
        property="twitter:description"
        name="twitter:description"
        content={
          workspace?.data?.owner?.username
            ? `📍 @${workspace.data.owner.username}'s workspace`
            : CONSTANTS.SEO_DESCRIPTION
        }
      />
      <meta
        property="og:description"
        name="og:description"
        content={
          workspace?.data?.owner?.username
            ? `📍 @${workspace.data.owner.username}'s workspace`
            : CONSTANTS.SEO_DESCRIPTION
        }
      />
      <meta
        property="description"
        name="description"
        content={
          workspace?.data?.owner?.username
            ? `📍 @${workspace.data.owner.username}'s workspace`
            : CONSTANTS.SEO_DESCRIPTION
        }
      />
      <meta
        property="twitter:image"
        name="twitter:image"
        content={
          workspace?.data?.thumbnail?.type == "image" &&
          typeof workspace.data.thumbnail.file == "string"
            ? workspace.data.thumbnail.file
            : `https://${server}/icon_big.png`
        }
      />
      <meta
        property="og:image"
        name="og:image"
        content={
          workspace?.data?.thumbnail?.type == "image" &&
          typeof workspace.data.thumbnail.file == "string"
            ? workspace.data.thumbnail.file
            : `https://${server}/icon_big.png`
        }
      />
      <meta
        property="apple-mobile-web-app-title"
        name="apple-mobile-web-app-title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : CONSTANTS.APP_NAME
        }
      />
      <meta
        property="twitter:title"
        name="twitter:title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : CONSTANTS.APP_NAME
        }
      />
      <meta
        property="og:title"
        name="og:title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : CONSTANTS.APP_NAME
        }
      />
    </>
  );
}
