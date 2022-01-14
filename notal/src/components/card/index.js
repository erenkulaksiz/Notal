import styles from './Card.module.scss';

import { useState } from 'react';

import Button from '../button';
import Input from '../input';

import MoreIcon from '../../../public/icons/more.svg';
import AddIcon from '../../../public/icons/add.svg';
import DragIcon from '../../../public/icons/drag.svg';
import EditIcon from '../../../public/icons/edit.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';

const Card = ({ card, cardKey, isOwner, onMoreClick, cardMore, onDeleteClick, onEditClick, editing, onEditCancel, onEditSubmit }) => {

    const [editCard, setEditCard] = useState({ title: card.title, desc: card.desc, color: card.color })

    return (<div className={styles.todo} key={cardKey}>
        {editing != true ? <><div className={styles.content}>
            <div className={styles.title}>
                <div>
                    <AddIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />
                </div>
                <h1>{card.title}</h1> {editing && "editing :D"}
            </div>
            <div className={styles.desc}>
                {card.desc}
            </div>
        </div>
            <div className={styles.controls}>
                <div className={styles.color} style={{ backgroundColor: card.color }} />
                {isOwner && <button className={styles.control}
                    onClick={() => onMoreClick()}>
                    <MoreIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 2, marginRight: 2, }} />
                </button>}
                {isOwner && <button className={styles.control} >
                    <DragIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 2, marginRight: 2, }} />
                </button>}
                {(cardMore.visible && cardMore.cardId == card.id) && <div className={styles.more}>
                    <button onClick={() => onEditClick()}>
                        <EditIcon height={24} width={24} fill={"#19181e"} />
                    </button>
                    <button onClick={() => onDeleteClick()}>
                        <DeleteIcon height={24} width={24} fill={"#19181e"} />
                    </button>
                </div>}
            </div></> : <div className={styles.editingCard}>
            <h1 style={{ marginTop: 6 }}>Card Title</h1>
            <Input
                type="text"
                placeholder="Card Title"
                onChange={e => setEditCard({ ...editCard, title: e.target.value })}
                value={editCard.title}
                style={{ width: "100%", borderWidth: 1, borderColor: "#19181e", borderStyle: "solid", marginTop: 8 }}
            />
            <h1 style={{ marginTop: 16 }}>Card Description</h1>
            <Input
                type="text"
                placeholder="Card Description"
                onChange={e => setEditCard({ ...editCard, desc: e.target.value })}
                value={editCard.desc}
                style={{ width: "100%", borderWidth: 1, borderColor: "#19181e", borderStyle: "solid", marginTop: 8 }}
                multiline
            />
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 16 }}>
                <h1 >Card Color</h1>
                <div className={styles.color} style={{ backgroundColor: editCard.color }} />
            </div>
            <select id="editCardColor" onChange={e => setEditCard({ ...editCard, color: e.target.value })}>
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
                <option value="orange">orange</option>
                <option value="yellow">yellow</option>
            </select>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button
                    text="Cancel"
                    onClick={() => onEditCancel()}
                    style={{ height: 48, borderRadius: 8, marginTop: 10, border: "none", width: "48%" }}
                    icon={<CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                    reversed
                />
                <Button
                    text="Edit"
                    onClick={() => onEditSubmit({ title: editCard.title, desc: editCard.desc, color: editCard.color })}
                    style={{ height: 48, borderRadius: 8, marginTop: 10, border: "none", width: "48%" }}
                    icon={<CheckIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                />
            </div>
        </div>}
    </div>)
}

export default Card;