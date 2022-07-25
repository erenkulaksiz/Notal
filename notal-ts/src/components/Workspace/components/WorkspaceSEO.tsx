import { NotalRootProps } from "@types";

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
            : "Take your notes to next level with Notal"
        }
      />
      <meta
        property="og:description"
        name="og:description"
        content={
          workspace?.data?.owner?.username
            ? `📍 @${workspace.data.owner.username}'s workspace`
            : "Take your notes to next level with Notal"
        }
      />
      <meta
        property="description"
        name="description"
        content={
          workspace?.data?.owner?.username
            ? `📍 @${workspace.data.owner.username}'s workspace`
            : "Take your notes to next level with Notal"
        }
      />
      <meta
        property="twitter:image"
        name="twitter:image"
        content={
          workspace?.data?.thumbnail?.type == "image" &&
          typeof workspace.data.thumbnail.file == "string"
            ? workspace.data.thumbnail.file
            : "https://notal.app/icon_big.png"
        }
      />
      <meta
        property="og:image"
        name="og:image"
        content={
          workspace?.data?.thumbnail?.type == "image" &&
          typeof workspace.data.thumbnail.file == "string"
            ? workspace.data.thumbnail.file
            : "https://notal.app/icon_big.png"
        }
      />
      <meta
        property="apple-mobile-web-app-title"
        name="apple-mobile-web-app-title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : "Notal"
        }
      />
      <meta
        property="twitter:title"
        name="twitter:title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : "Notal"
        }
      />
      <meta
        property="og:title"
        name="og:title"
        content={
          workspace?.data?.title
            ? `${workspace.data.title} • notal.app`
            : "Notal"
        }
      />
    </>
  );
}
