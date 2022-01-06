
const Workspace = (props) => {
    return (<div>
        {"id:" + props.id}
    </div>)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let id = {};

    const queryId = query?.id;

    if (req) {
        id = queryId
    }
    return { props: { id } }
}