import styles from './Nav.module.scss';

import Link from 'next/link';
import { useState } from 'react';

import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';
import EditIcon from '../../../public/icons/edit.svg';
import StarFilledIcon from '../../../public/icons/star_filled.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import AddIcon from '../../../public/icons/add.svg';

import Input from '../input';

const WorkspaceNav = ({ workspace, isOwner, onAddField, onFinishEditing, onDeletePress, onStarPress }) => {

    const [addingField, setAddingField] = useState(false);
    const [addField, setAddField] = useState({ title: "" });

    const [editingWorkspace, setEditingWorkspace] = useState(false);
    const [editedWorkspace, setEditedWorkspace] = useState({ title: workspace.title, desc: workspace.desc });

    return (<div className={styles.nav}>
        <div className={styles.meta}>
            {addingField ? <div className={styles.addField}>
                <Input
                    type="text"
                    placeholder="Field Name"
                    onChange={e => setAddField({ ...addField, title: e.target.value })}
                    style={{ width: "100%" }}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            setAddingField(false);
                            onAddField({ title: addField.title });
                        }
                    }}
                    autoFocus
                />
                <div className={styles.editBtn}>
                    <button onClick={() => {
                        setAddingField(false);
                        setAddField({ ...addField, title: "" });
                    }}
                        style={{ marginRight: 8 }}>
                        <CrossIcon height={24} width={24} fill={"#19181e"} />
                    </button>
                    <button onClick={() => {
                        setAddingField(false);
                        setAddField({ title: "" });
                        if (addField.title) {
                            onAddField({ title: addField.title });
                        }
                    }}>
                        <CheckIcon height={24} width={24} fill={"#19181e"} />
                    </button>
                </div>
            </div> : <div className={styles.details}>
                {editingWorkspace ? <input type="text"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            setEditingWorkspace(false);
                            onFinishEditing({ title: editedWorkspace.title, desc: editedWorkspace.desc });
                        }
                    }}
                    defaultValue={workspace?.title}
                    onChange={e => setEditedWorkspace({ ...editedWorkspace, title: e.target.value })}
                    placeholder={"Workspace Title"}
                /> : <h1>{workspace?.title}</h1>}

                {editingWorkspace ? <input type="text"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            setEditingWorkspace(false);
                            onFinishEditing({ title: editedWorkspace.title, desc: editedWorkspace.desc });
                        }
                    }}
                    defaultValue={workspace?.desc}
                    onChange={e => setEditedWorkspace({ ...editedWorkspace, desc: e.target.value })}
                    placeholder={"Workspace Description"}
                /> : <span>{workspace?.desc}</span>}
            </div>}
            {(isOwner && !addingField) && (editingWorkspace ? <div className={styles.editBtn}>
                <button onClick={() => setEditingWorkspace(false)} style={{ marginRight: 8 }}>
                    <CrossIcon height={24} width={24} fill={"#19181e"} />
                </button>
                <button onClick={() => {
                    setEditingWorkspace(false);
                    onFinishEditing({ title: editedWorkspace.title, desc: editedWorkspace.desc });
                }}>
                    <CheckIcon height={24} width={24} fill={"#19181e"} />
                </button>
            </div> : <div className={styles.editBtn}>
                <button onClick={() => setEditingWorkspace(true)}>
                    <EditIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                </button>
            </div>)}
        </div>
        {!isOwner && <div className={styles.workspaceOwnerWrapper}>
            <Link href="/profile/[username]" as={`/profile/${workspace?.profile?.username}`} passHref>
                <a>
                    <div className={styles.avatar}>
                        <img
                            src={workspace?.profile?.avatar}
                            alt="Avatar"
                            width={33}
                            height={33}
                        />
                    </div>
                    <div className={styles.data}>
                        <h1>{workspace?.profile?.fullname}</h1>
                        <h2>@{workspace?.profile?.username}</h2>
                    </div>
                </a>
            </Link>
        </div>}
        {!editingWorkspace && !addingField && isOwner && <div className={styles.buttons}>
            <div className={styles.workspaceBtn}>
                <button onClick={() => onStarPress()} >
                    {workspace?.starred ? <StarFilledIcon height={24} width={24} style={{ fill: "#dbb700" }} /> : <StarOutlineIcon height={24} width={24} />}
                </button>
            </div>
            <div className={styles.workspaceBtn}>
                <button onClick={() => { }} >
                    <VisibleIcon height={24} width={24} />
                </button>
            </div>
            <div className={styles.workspaceBtn}>
                <button onClick={() => onDeletePress()} >
                    <DeleteIcon height={24} width={24} />
                </button>
            </div>
            <div className={styles.workspaceBtn}>
                <button onClick={() => setAddingField(true)} >
                    <AddIcon height={24} width={24} />
                </button>
            </div>
        </div>}
    </div>)
}

export default WorkspaceNav;