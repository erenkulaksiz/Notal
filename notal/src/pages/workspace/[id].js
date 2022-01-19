import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDragLayer } from 'react-dnd';

import styles from '../../../styles/App.module.scss';
import useAuth from '../../hooks/auth';
import useTheme from '../../hooks/theme';

import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import SyncIcon from '../../../public/icons/sync.svg';

import Header from '../../components/header';
import Button from '../../components/button';
import Alert from '../../components/alert';
import WorkspaceNav from '../../components/workspaceNav';
import Field from '../../components/field';
import Card from '../../components/card';

import { server } from '../../config';
import { CheckToken } from '../../utils';
import { withCheckUser } from '../../hooks/route';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const [menuToggle, setMenuToggle] = useState(false);

    // delete modal
    const [deleteWorkspaceModal, setDeleteWorkspaceModal] = useState(false);

    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [cardMore, setCardMore] = useState({ visible: false, cardId: "" });
    const [cardEditing, setCardEditing] = useState({ editing: false, id: "", title: "", desc: "", color: "red" });

    const [_workspace, _setWorkspace] = useState({});

    useEffect(() => {
        console.log("props: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (props.validate?.error == "no-token" || res || props.validate?.error == "validation-error" || props.validate?.error == "auth/id-token-expired") {
                router.replace(router.asPath);
            }
        })();
    }, [props]);

    useEffect(() => {
        if (props.workspace?.success == true) {
            setLoadingWorkspace(false);
            _setWorkspace(props.workspace?.data);
        }
    }, [props.workspace]);

    const DragLayer = () => {
        const { isDragging, currentOffset, item } = useDragLayer(
            (monitor) => {
                return {
                    isDragging: monitor.isDragging(),
                    currentOffset: monitor.getSourceClientOffset(),
                    item: monitor.getItem()
                };
            }
        );
        return isDragging && currentOffset
            ? <Card
                card={item.card}
                isOwner={isOwner}
                cardMore={cardMore}
                style={{
                    transform: `translate(${currentOffset.x - 320}px, ${currentOffset.y - 20}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 999,

                    width: 340,
                }}
            />
            : null;
    }

    const handle = {
        finishEditing: ({ title, desc }) => {
            if (_workspace.title != title || _workspace.desc != desc) {
                const data = auth.workspace.editWorkspace({ id: _workspace.id, title, desc });
                if (data?.error) console.error("error on edit workspace: ", data?.error);
                const newWorkspace = { ..._workspace, title, desc };
                _setWorkspace(newWorkspace);
            }
        },
        starWorkspace: () => {
            const data = auth.workspace.starWorkspace({ id: _workspace.id });
            if (data?.error) console.error("error on star workspace: ", data.error);
            const newWorkspace = { ..._workspace, starred: !_workspace.starred };
            _setWorkspace(newWorkspace);
        },
        addField: async ({ title }) => {
            const data = await auth.workspace.field.addField({ title: title, id: _workspace.id, filterBy: "index" });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("addfield error: ", data?.error);
            }
        },
        editField: ({ id, title }) => {
            const data = auth.workspace.field.editField({ id, title, workspaceId: _workspace.id });
            if (data?.error) console.error("error on edit field: ", data.error);
            const index = _workspace.fields.findIndex(el => el.id == id);
            const newField = { ..._workspace.fields[index], title };
            const newFields = _workspace.fields;
            newFields[index] = newField;
            const newWorkspace = { ..._workspace, fields: newFields };
            _setWorkspace(newWorkspace);
        },
        deleteField: ({ id }) => {
            const data = auth.workspace.field.removeField({ id, workspaceId: _workspace.id });
            if (data?.error) console.error("error on delete field: ", data.error);
            const newFields = _workspace.fields.filter(el => el.id != id);
            const newWorkspace = { ..._workspace, fields: [...newFields] }
            _setWorkspace(newWorkspace);
        },
        deleteWorkspace: () => {
            const data = auth.workspace.deleteWorkspace({ id: _workspace.id });
            if (data?.error) console.error("error on delete workspace: ", data.error);
            router.replace("/");
        },
        addCardToField: async ({ fieldId, title, desc, color }) => {
            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: _workspace.id,
                title,
                desc,
                color
            });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("add card error: ", data?.error);
            }
        },
        deleteCard: ({ id, fieldId }) => {
            const data = auth.workspace.field.removeCard({
                id,
                fieldId,
                workspaceId: _workspace.id,
            });
            if (data?.error) console.error("error on delete card: ", data.error);

            const newWorkspace = _workspace;
            const _fieldIndex = newWorkspace.fields.findIndex(el => el.id == fieldId);
            const _cardIndex = newWorkspace.fields[_fieldIndex].cards.findIndex(el => el.id == id);
            const _fieldCards = newWorkspace.fields[_fieldIndex].cards;
            _fieldCards.splice(_cardIndex, 1);
            _setWorkspace(newWorkspace);
        },
        editCard: async ({ title, desc, color, id, fieldId }) => {
            const data = await auth.workspace.field.editCard({
                id: id,
                fieldId,
                workspaceId: _workspace.id,
                title,
                desc,
                color,
            });

            if (data.success) {
                setCardEditing({ ...cardEditing, editing: false, id: "" });
                setCardMore({ ...cardMore, visible: false, cardId: "" });
                router.replace(router.asPath);
            } else {
                console.log("edit card error: ", data?.error);
            }
        },
        cardSwap: async ({ cardId, fieldId, swapType, toFieldId, toCardId }) => {
            if (swapType == "up" || swapType == "down" || swapType == "dnd") {
                const fieldIndex = _workspace.fields.findIndex(el => el.id == fieldId);
                const newFields = _workspace.fields;
                const field = newFields[fieldIndex];
                const cardIndexArr = field.cards.findIndex(el => el.id == cardId)
                const card = field.cards[cardIndexArr];
                const cardIndex = field.cards.findIndex(el => el.index == card.index);

                const toFieldIndex = newFields.findIndex(el => el.id == toFieldId);
                const toField = newFields[toFieldIndex];
                const toCardIndex = toField.cards.findIndex(el => el.id == toCardId);
                const toCard = toField.cards[toCardIndex];

                if (swapType == "up") {
                    if (cardIndex != 0) {
                        // send data if you can go up
                        const swapCard = field.cards[cardIndex - 1].index
                        field.cards[cardIndex - 1].index = card.index;
                        field.cards[cardIndex].index = swapCard;
                        const newWorkspace = { ..._workspace, fields: newFields };
                        _setWorkspace(newWorkspace);
                        const data = await auth.workspace.field.cardSwap({ cardId, fieldId, swapType, workspaceId: _workspace.id });
                        if (data?.error) console.error("error on swap card: ", data.error);
                    }
                } else if (swapType == "down") {
                    if (cardIndex < (field.cards.length - 1)) {
                        // send data if you can go down
                        const swapCard = field.cards[cardIndex + 1].index
                        field.cards[cardIndex + 1].index = card.index;
                        field.cards[cardIndex].index = swapCard;
                        const newWorkspace = { ..._workspace, fields: newFields };
                        _setWorkspace(newWorkspace);
                        const data = await auth.workspace.field.cardSwap({ cardId, fieldId, swapType, workspaceId: _workspace.id });
                        if (data?.error) console.error("error on swap card: ", data.error);
                    }
                } else if (swapType == "dnd") {
                    // drag drop
                    //const data = await auth.workspace.field.cardSwap({ cardId, fieldId, swapType, workspaceId: _workspace.id, toFieldId, toCardId });
                    // if (data?.error) console.error("error on swap card: ", data.error);
                    //console.log("dnd res: ", data);

                    if (toFieldId != fieldId) { // #TODO: rewrite here


                        const _toCard = toCard;

                        newFields[fieldIndex].cards[cardIndexArr] = { ..._toCard, index: card.index };
                        newFields[toFieldIndex].cards[toCardIndex] = { ...card, index: _toCard.index };;


                        const newWorkspace = { ..._workspace, fields: newFields };
                        _setWorkspace(newWorkspace);

                        //console.log("newWorkspace: ", newWorkspace);
                    } else {
                        alert("cant drag to same");
                    }

                    /* if (data.success) {
                         //router.replace(router.asPath);
                     }*/
                }

            } else {
                alert("error with cardswap, no swaptype");
            }
        }
    }

    const isOwner = (props.workspace?.success == true ? _workspace.owner == auth.authUser?.uid : false);

    if (loadingWorkspace) {
        return <div className={styles.container} data-theme={theme.UITheme}>
            <div className={styles.loadingContainer}>
                <SyncIcon height={24} width={24} className={styles.loadingIconAuth} style={{ marginTop: 24 }} />
                <span>Loading Workspace...</span>
            </div>
        </div>
    }

    return (<div className={styles.container} data-theme={theme.UITheme}>
        <Head>
            <title>{props.workspace?.success == true ? _workspace.title : "404"}</title>
            <meta name="description" content="Notal" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header
            menuToggle={menuToggle}
            onMenuToggle={val => setMenuToggle(val)}
            userData={{ fullname: props.validate?.data?.fullname, email: props.validate?.data?.email }}
            avatarURL={props.validate.data?.avatar}
            loggedIn={auth?.authUser}
            onLogin={() => router.push("/login")}
            onLogout={() => {
                auth.users.logout();
                //router.push("/login");
            }}
            onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
            onHeaderHome={() => router.push("/")}
            leftContainer={<Button
                text="Home"
                onClick={() => router.replace("/")}
                style={{ height: 44, borderRadius: 8, }}
                icon={<HomeFilledIcon height={24} width={24} />}
            />}
            currTheme={theme.UITheme}
            onThemeChange={() => theme.toggleTheme()}
        />

        <div className={styles.content_workspace}>
            {props.workspace.success == true ? <>
                <WorkspaceNav
                    isOwner={isOwner}
                    workspace={_workspace}
                    onAddField={({ title }) => handle.addField({ title })}
                    onFinishEditing={({ title, desc }) => handle.finishEditing({ title, desc })}
                    onDeletePress={() => setDeleteWorkspaceModal(true)}
                    onStarPress={() => handle.starWorkspace()}
                />
                <div className={styles.wrapper}>
                    <div className={styles.fields}>
                        {_workspace.fields.length == 0 ? <div>no fields to list. press + icon on top nav bar</div> :
                            _workspace.fields.map(el => {
                                return <Field
                                    isOwner={isOwner}
                                    key={el.id}
                                    field={el}
                                    onEditField={({ id, title }) => {
                                        handle.editField({ id, title });
                                    }}
                                    onDeleteField={({ id }) => {
                                        handle.deleteField({ id });
                                    }}
                                    onAddCardToField={({ fieldId, title, desc, color }) => {
                                        handle.addCardToField({ fieldId, title, desc, color });
                                    }}
                                    onDeleteCard={({ id, fieldId }) => {
                                        handle.deleteCard({ id, fieldId });
                                    }}
                                    onEditCard={({ title, desc, color, cardId, fieldId }) => {
                                        handle.editCard({ title, desc, color, id: cardId, fieldId });
                                    }}
                                    cardMore={cardMore}
                                    setCardMore={setCardMore}
                                    onMore={({ cardId, fieldId }) => {
                                        setCardMore({ ...cardMore, visible: (cardMore.cardId == cardId ? !cardMore.visible : true), cardId })
                                    }}
                                    onCardUp={({ cardId, fieldId }) => {
                                        handle.cardSwap({ cardId, fieldId, swapType: "up" });
                                    }}
                                    onCardDown={({ cardId, fieldId }) => {
                                        handle.cardSwap({ cardId, fieldId, swapType: "down" });
                                    }}
                                    onCardDrop={({ cardId, toCardId, fieldId, toFieldId }) => {
                                        console.log("cardId: ", cardId, " toCardId: ", toCardId, " fieldId:", fieldId, " toFieldId:", toFieldId);
                                        handle.cardSwap({ cardId, toCardId, fieldId, toFieldId, swapType: "dnd" })
                                    }}
                                />
                            })}
                        <DragLayer />
                    </div>
                </div>
            </> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%", height: "100%" }}>
                <h1 style={{ marginBottom: 24, fontSize: "4em", fontWeight: "600", textAlign: "center" }}>[404]</h1>
                <div style={{ fontSize: "1.8em", fontWeight: "600", textAlign: "center" }}>
                    We couldnt find this workspace in the galaxy.<br />Its probably on a another galaxy.
                </div>
                <Button
                    text="Home"
                    onClick={() => router.replace("/")}
                    style={{ height: 54, borderRadius: 8, width: 380, marginTop: 24 }}
                    icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                />
                <Button
                    text="Back"
                    onClick={() => router.back()}
                    style={{ height: 54, borderRadius: 8, width: 380, marginTop: 12 }}
                    icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                />
            </div>
            }
        </div>
        <Alert
            visible={deleteWorkspaceModal}
            icon={<DeleteIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            title="Delete Workspace"
            textColor="#fff"
            text="Are you sure want to delete this workspace?"
            closeVisible
            onCloseClick={() => {
                setDeleteWorkspaceModal(false)
            }}
            buttons={[
                <Button
                    text="Cancel"
                    onClick={() => setDeleteWorkspaceModal(false)}
                    icon={<CrossIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                    key={0}
                />,
                <Button
                    text="Delete"
                    icon={<DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                    style={{ borderStyle: "none" }}
                    onClick={() => handle.deleteWorkspace()}
                    reversed
                    key={1}
                />
            ]}
        />
    </div >)
}

export default withCheckUser(Workspace)

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspace = {};

    const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;
        //const emailCookie = req.cookies.email;

        const dataWorkspace = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id: queryId, action: "GET_WORKSPACE" }),
        }).then(response => response.json());

        let fields = [];

        if (dataWorkspace.data?.fields) {
            fields = Object.keys(dataWorkspace.data.fields).map((el, index) => {
                return { ...dataWorkspace.data?.fields[el], id: Object.keys(dataWorkspace.data.fields)[index] }
            });
            fields.map((el, index) => {
                if (el.cards) {
                    const cards = Object.keys(el.cards).map((elx, index) => {
                        return { ...el.cards[elx], id: Object.keys(el.cards)[index] }
                    })

                    fields[index].cards = cards;
                }
            })
        }

        if (dataWorkspace.success) {
            workspace = { ...dataWorkspace, data: { ...dataWorkspace.data, id: queryId, fields: [...fields] } };
        } else {
            workspace = { success: false }
        }
        console.log("RES DATA WORKSPACE: ", dataWorkspace);

        if (authCookie) {
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json());

            if (dataValidate.success) {
                validate = { ...dataValidate };
            } else {
                validate = { error: dataValidate?.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate, workspace } }
}