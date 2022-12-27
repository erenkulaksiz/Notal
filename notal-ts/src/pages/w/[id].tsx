import type { GetServerSidePropsContext } from "next";

export default function WorkspaceShortcut() {
  return null;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (ctx.req) {
    const { res } = ctx;
    const query = Array.isArray(ctx.query.id) ? ctx.query.id[0] : ctx.query.id;
    res.writeHead(301, { Location: `/workspace/${query}` });
    return res.end();
  }
}
