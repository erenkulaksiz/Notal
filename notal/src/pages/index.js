import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

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

import Input from '../components/input';
import Button from '../components/button';
import Header from '../components/header';
import Alert from '../components/alert';

import { withAuth } from '../hooks/route';
import useAuth from '../hooks/auth';

const Home = (props) => {
  const auth = useAuth();
  const router = useRouter();

  const [menuToggle, setMenuToggle] = useState(false);

  //filter and view
  const [viewing, setViewing] = useState("workspaces");
  const [filter, setFilter] = useState(null);

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ workspace: -1, visible: false });

  // new workspace states
  const [newWorkspaceVisible, setNewWorkspaceVisible] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ title: "", desc: "", starred: false });
  const [newWorkspaceErr, setNewWorkspaceErr] = useState({ title: false, desc: false });

  // Register States
  const [register, setRegister] = useState({ fullname: "", username: "" });
  const [regErr, setRegErr] = useState({ fullname: false, username: false, register: false });
  const [registerAlertVisible, setRegisterAlertVisible] = useState(false);
  //

  useEffect(() => {
    if (viewing == "favorites") {
      setFilter("favorites");
    } else {
      setFilter(null);
    }
  }, [viewing]);

  useEffect(() => {
    console.log("props indexjs: ", props);

    const checkToken = async () => {
      if (props.validate?.error == "auth/id-token-expired" || props.validate?.error == "auth/argument-error") {
        try {
          const { token } = await auth.users.getIdToken();
          console.log("token: ", token);
          await cookie.set("auth", token, { expires: 1 });
          router.replace(router.asPath);
          return;
        } catch (err) {
          console.error(err);
          auth.logout();
          return;
        }
      }
      if (!props.validate.data?.username?.length) { // if theres no username is present
        setRegisterAlertVisible(true);
      }
    }

    checkToken();
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();

    if (register.username.length < 3 || register.username == '') {
      setRegErr({ ...regErr, username: "Please enter a valid username." });
      return;
    } else {
      setRegErr({ ...regErr, username: false });
    }

    if (register.fullname.length < 3 || register.fullname == '') {
      setRegErr({ ...regErr, fullname: "Please enter a valid fullname." });
      return;
    } else {
      setRegErr({ ...regErr, fullname: false });
    }

    const result = await auth.users.updateUser({ uid: props.auth.authUser.uid, fullname: register.fullname, username: register.username.toLowerCase() });
    console.log("res: ", result.error?.error ?? "");
    if (result.success) {
      setRegisterAlertVisible(false);
      setRegErr({ fullname: false, username: false, register: false });
      //setValidate({ ...validate, data: { ...validate.data, fullname: register.fullname, username: register.username } })
      router.replace(router.asPath);
    } else if (result.error?.success == false && result?.error?.error == "auth/username-already-in-use") {
      setRegErr({ fullname: false, username: "This username is already in use.", register: false });
      return;
    }
  }

  const workspace = {
    create: async (e) => {
      e.preventDefault();

      if (!newWorkspace.title || newWorkspace.title.length == 0) {
        setNewWorkspaceErr({ ...newWorkspaceErr, title: "Please enter a valid title." });
        return;
      } else {
        setNewWorkspaceErr({ ...newWorkspaceErr, title: false });
      }

      if (!newWorkspace.desc || newWorkspace.desc.title == 0) {
        setNewWorkspaceErr({ ...newWorkspaceErr, desc: "Please enter a valid description." });
        return;
      } else {
        setNewWorkspaceErr({ ...newWorkspaceErr, desc: false });
      }

      setNewWorkspaceErr({ ...newWorkspaceErr, desc: false, title: false, });

      const data = await auth.workspace.createWorkspace({ title: newWorkspace.title, desc: newWorkspace.desc, starred: newWorkspace.starred });

      console.log("data: ", data);

      if (data?.success) {
        setNewWorkspaceVisible(false);
        setNewWorkspace({ ...newWorkspace, title: "", desc: "", starred: false });
        router.replace(router.asPath);
      }

    },
    delete: async ({ id }) => {
      setDeleteModal({ visible: false, workspace: -1 }); // set visiblity to false and id to -1

      const data = await auth.workspace.deleteWorkspace({ id });

      if (data.success) {
        router.replace(router.asPath);
      }
    },
    star: async ({ id }) => {
      // recieve workspace id and star it

      const data = await auth.workspace.starWorkspace({ id });

      if (data.success) {
        router.replace(router.asPath);
      } else {
        console.log("star error: ", data?.error);
      }
    },
    closeModal: () => {
      setNewWorkspaceVisible(false);
      setNewWorkspaceErr({ ...newWorkspace, desc: false, title: false });
      setNewWorkspace({ ...newWorkspace, title: "", desc: "", starred: "" });
    },
    getWorkspacesWithFilter: (workspaces) => {
      if (filter == "favorites") {
        if (workspaces) return workspaces.filter(el => el.starred == true);
        else return []
      } else {
        // no filter
        if (workspaces) return workspaces;
        else return []
      }
    }
  }

  if (registerAlertVisible) return <div className={styles.registerAlertContainer}>
    <div className={styles.content}>
      <div className={styles.alert}>
        <div className={styles.title}>
          <CheckIcon height={24} width={24} fill={"#fff"} />
          <span style={{ color: "white", marginLeft: 8 }}>One more step...</span>
        </div>
        <div className={styles.body}>
          <form id="register" onSubmit={e => registerUser(e)}>
            <div style={{ width: "100%" }}>
              Username
              <Input
                type="text"
                placeholder="Username (e.g. erentr)"
                onChange={e => setRegister({ ...register, username: e.target.value.replace(/[^\w\s]/gi, "").replace(/\s/g, '').toLowerCase() })}
                value={register.username}
                icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                error={regErr.username != false}
                required
                style={{ marginTop: 18 }}
                maxLength={24}
              />
              {regErr.username != false && <p className={styles.errorMsg}>{regErr.username}</p>}
            </div>
            <div style={{ width: "100%", marginTop: 24 }}>
              Fullname
              <Input
                type="text"
                placeholder="Fullname (e.g. John Doe)"
                onChange={e => setRegister({ ...register, fullname: e.target.value })}
                value={register.fullname}
                icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                error={regErr.fullname != false}
                required
                style={{ marginTop: 18 }}
              />
            </div>
          </form>
        </div>
        <div className={styles.buttons}>
          <Button
            text="Logout"
            style={{ border: "none", margin: 24, marginBottom: 0, }}
            onClick={() => auth.users.logout()}
          />
          <Button
            text="Complete"
            type="submit"
            form="register"
            icon={<CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
            style={{ border: "none", margin: 24, marginBottom: 0, }}
            reversed
          />
        </div>
      </div>
    </div>
    <span className={styles.overlay} />
  </div>

  return (<div className={styles.container}>
    <Head>
      <title>Home · Notal</title>
      <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header
      menuToggle={menuToggle}
      onMenuToggle={val => setMenuToggle(val)}
      userData={{ fullname: props.validate?.data?.fullname, email: auth.authUser.email }}
      avatarURL={props.validate?.data?.avatar}
      onLogout={() => auth.users.logout()}
      onProfile={() => router.push(`/profile/${props?.validate?.data?.username}`)}
      onHeaderHome={() => router.replace('/')}
      showCreate={false}
    />
    {/* ------------------------------------------------------------------------------------------------------------ */}
    <div className={styles.content_home}>
      <div className={styles.buttons}>
        <Button
          text="Workspaces"
          onClick={() => setViewing("workspaces")}
          style={{ justifyContent: "flex-start", borderRadius: 8, width: "90%", marginTop: 24, height: 54 }}
          icon={<DashboardIcon height={24} width={24} fill={viewing == "workspaces" ? "#fff" : "#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />}
          reversed={viewing != "workspaces"}
        />
        <Button
          text="Favorites"
          onClick={() => setViewing("favorites")}
          style={{ justifyContent: "flex-start", borderRadius: 8, width: "90%", marginTop: 12, height: 54 }}
          icon={viewing == "favorites" ? <StarFilledIcon height={24} width={24} fill={"#fff"} style={{ marginLeft: 8, marginRight: 8, }} /> : <StarOutlineIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />}
          reversed={viewing != "favorites"}
        />
      </div>
      <div className={styles.workspaces}>
        <div className={styles.workspaces__wrapper}>
          <div className={styles.title}>
            <div className={styles.title__icon}>
              <UserIcon height={24} width={24} fill={"#fff"} style={{ marginLeft: 8, marginRight: 8, }} />
            </div>
            <div className={styles.title__title}>
              Your Workspaces
            </div>
          </div>
          <div className={styles.content}>
            {(workspace.getWorkspacesWithFilter(props.workspaces?.data).length > 0 ? workspace.getWorkspacesWithFilter(props.workspaces?.data).map((element, index) => <div className={styles.workspace} key={index}>
              <Link href="/workspace/[pid]" as={`/workspace/${element.id}`}>
                <a style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}></a>
              </Link>
              <div style={{ zIndex: 2, marginLeft: 16, marginBottom: 16 }}>
                <div className={styles.footer} >
                  <div className={styles.title}>
                    {element.title}
                  </div>
                  <div className={styles.desc}>
                    {element.desc}
                  </div>
                </div>
                <button className={styles.fav} onClick={() => workspace.star({ id: element.id })} >
                  {element?.starred == true ? <StarFilledIcon height={24} width={24} fill={"#dbb700"} /> : <StarOutlineIcon height={24} width={24} fill={"#19181e"} />}
                </button>
                <button className={styles.deleteWorkspace} onClick={() => setDeleteModal({ workspace: element.id, visible: true })}>
                  <DeleteIcon height={24} width={24} fill={"#19181e"} />
                </button>
              </div>
            </div>) : <div>it seems like theres no workspaces here...</div>)}
          </div>
        </div>
      </div>
    </div>
    {/* ------------------------------------------------------------------------------------------------------------ */}
    <div className={styles.navContainer}>
      <div className={styles.navContainer__buttons}>
        <Button
          text="Create Workspace"
          onClick={() => setNewWorkspaceVisible(true)}
          style={{ height: 54, borderRadius: 8, minWidth: 160 }}
          icon={<AddIcon height={24} width={24} fill={"#19181e"} />}
          reversed
        />
        <Button
          text="About"
          onClick={() => router.push("/about")}
          style={{ height: 54, borderRadius: 8, minWidth: 160 }}
          icon={<QuestionIcon height={24} width={24} fill={"#19181e"} />}
          reversed
        />
      </div>
    </div>
    {newWorkspaceVisible && <div className={styles.createWorkspaceContainer}>
      <div className={styles.content}>
        <div className={styles.alert}>
          <div className={styles.title}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <AddIcon height={24} width={24} fill={"#fff"} />
              <h1 style={{ color: "white", marginLeft: 8 }}>Creating a Workspace</h1>
            </div>
            <button className={styles.closeButton} onClick={() => workspace.closeModal()}>
              <CrossIcon height={24} width={24} fill={"#fff"} />
            </button>
          </div>
          <div className={styles.body}>
            <form id="createWorkspace" onSubmit={e => workspace.create(e)}>
              <div className={styles.inputContainer}>
                <h1>Workspace Title</h1>
                <Input
                  type="text"
                  placeholder="Enter a workspace title..."
                  onChange={e => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
                  value={newWorkspace.title}
                  error={newWorkspaceErr.title != false}
                  //required
                  style={{ marginTop: 18 }}
                />
                {newWorkspaceErr.title != false && <p className={styles.errorMsg}>{newWorkspaceErr.title}</p>}
              </div>
              <div className={styles.inputContainer}>
                <h1>Workspace Description</h1>
                <Input
                  type="text"
                  placeholder="Enter a workspace description..."
                  onChange={e => setNewWorkspace({ ...newWorkspace, desc: e.target.value })}
                  value={newWorkspace.desc}
                  error={newWorkspaceErr.desc != false}
                  //required
                  style={{ marginTop: 18 }}
                />
                {newWorkspaceErr.desc != false && <p className={styles.errorMsg}>{newWorkspaceErr.desc}</p>}
              </div>
              <div className={styles.inputContainer}>
                {/*<div>
                  <input type="checkbox" id="useTemplate" name="useTemplate" />
                  <label htmlFor="useTemplate" style={{ marginLeft: 8, fontSize: "1.2em", color: "white" }}>Use Template</label>
                </div>*/}
                <div>
                  <input type="checkbox" id="starred" name="starred" onChange={e => setNewWorkspace({ ...newWorkspace, starred: e.target.checked })} value={newWorkspace.starred} />
                  <label htmlFor="starred" style={{ marginLeft: 8, fontSize: "1.2em", color: "white" }}>Star this workspace</label>
                </div>
              </div>
            </form>
          </div>
          <div className={styles.buttons}>
            <Button
              text="Cancel"
              onClick={() => workspace.closeModal()}
              style={{ height: 54, borderRadius: 8, width: "49%" }}
            />
            <Button
              text="Create"
              type="submit"
              form="createWorkspace"
              style={{ height: 54, borderRadius: 8, width: "49%", border: "none" }}
              icon={<CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />}
              reversed
            />
          </div>
        </div>
      </div>
      <span className={styles.overlay} />
    </div>}
    <Alert
      visible={deleteModal.visible}
      icon={<DeleteIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
      title="Delete Workspace"
      textColor="#fff"
      text="Are you sure want to delete this workspace?"
      closeVisible
      onCloseClick={() => {
        setDeleteModal({ workspace: -1, visible: false })
      }}
      buttons={[
        <Button
          text="Cancel"
          onClick={() => setDeleteModal({ ...deleteModal, visible: false })}
          key={0}
        />,
        <Button
          text="Delete"
          icon={<DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
          style={{ borderStyle: "none" }}
          onClick={() => workspace.delete({ id: deleteModal.workspace })}
          reversed
          key={1}
        />
      ]}
    />
  </div>)
}

export default withAuth(Home);

export async function getServerSideProps(ctx) {
  const { req, res, query } = ctx;
  let validate = {};
  let workspaces = {};

  if (req) {
    const authCookie = req.cookies.auth;
    //const emailCookie = req.cookies.email;

    if (authCookie) {
      const dataValidate = await fetch(`${server}/api/validate`, {
        'Content-Type': 'application/json',
        method: "POST",
        body: JSON.stringify({ token: authCookie }),
      }).then(response => response.json());

      if (dataValidate.success) {
        validate = { ...dataValidate };

        const dataWorkspaces = await fetch(`${server}/api/workspace`, {
          'Content-Type': 'application/json',
          method: "POST",
          body: JSON.stringify({ uid: dataValidate.uid, action: "GET_WORKSPACES" }),
        }).then(response => response.json());

        if (dataWorkspaces.success) {
          if (dataWorkspaces?.data) {
            const getWorkspaces = Object.keys(dataWorkspaces.data).map((el, index) => { return { ...dataWorkspaces.data[el], id: Object.keys(dataWorkspaces.data)[index] } });
            workspaces = { data: getWorkspaces, success: true };
          } else {
            workspaces = { success: true }
          }
        }
      } else {
        validate = { error: dataValidate?.error?.code }
      }
    }
  }
  return { props: { validate, workspaces } }
}