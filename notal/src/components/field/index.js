import styles from './Field.module.scss';

import { useState } from 'react';

import CheckIcon from '../../../public/icons/check.svg';
import EditIcon from '../../../public/icons/edit.svg';
import AddIcon from '../../../public/icons/add.svg';
import MoreIcon from '../../../public/icons/more.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import CrossIcon from '../../../public/icons/cross.svg';

import Input from '../../components/input';
import Card from '../../components/card';
import AddCard from '../../components/addCard';
import Button from '../button';

const Field = ({ isOwner, field, onEditCard, onDeleteField, onEditField, onDeleteCard, onAddCardToField, onMore, cardMore, setCardMore }) => {

    const [addingCard, setAddingCard] = useState({ fieldId: "", adding: false });

    const [editedField, setEditedField] = useState({ title: "" });
    const [editingField, setEditingField] = useState({ editing: false, fieldId: "" });
    const [deleteField, setDeleteField] = useState({ fieldId: "", deleting: false });

    const [cardEditing, setCardEditing] = useState({ editing: false, id: "", title: "", desc: "", color: "red" });

    const editField = () => {
        onEditField({ id: field.id, title: editedField.title });
        setEditingField({ editing: false, fieldId: "" });
    }

    return (<div className={styles.field}>
        <div className={styles.header}>
            {(editingField.editing && editingField.fieldId == field.id) ? <div>
                <Input
                    type="text"
                    placeholder="Field Title"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            editField();
                        }
                    }}
                    onChange={e => {
                        setEditedField({ ...editedField, title: e.target.value });
                    }}
                    defaultValue={field.title}
                    style={{ width: "90%" }}
                />
            </div> : <a href="#" onClick={() => {
                if (isOwner) {
                    setEditingField({ ...editingField, editing: true, fieldId: field.id });
                }
            }}>
                {field.title}
                {isOwner && <EditIcon height={24} width={24} fill={"#fff"} style={{ marginLeft: 8, marginRight: 8, }} />}
            </a>}
            {(editingField.editing && editingField.fieldId == field.id) ? <div className={styles.controls}>
                <button onClick={() => setEditingField({ ...editingField, editing: false, fieldId: "" })} style={{ marginLeft: 0 }}>
                    <CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                </button>
                <button style={{ marginLeft: 4 }} onClick={() => editField()}>
                    <CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                </button>
            </div> : <div className={styles.controls}>
                {!(isOwner && deleteField.fieldId == field.id) ? (isOwner && <button onClick={() => setDeleteField({ ...deleteField, deleting: true, fieldId: field.id })}>
                    <DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                </button>) :
                    <button onClick={() => setDeleteField({ ...deleteField, deleting: false, fieldId: "" })}>
                        <CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                    </button>}
                {!(isOwner && deleteField.fieldId == field.id) ? (isOwner && <button>
                    <MoreIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                </button>) :
                    <button onClick={() => {
                        onDeleteField({ id: deleteField.fieldId });
                        setDeleteField({ ...deleteField, deleting: false, fieldId: "" });
                        //handle.deleteField({ id: deleteField.fieldId });
                    }}>
                        <CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                    </button>}
            </div>}
        </div>
        <div className={styles.cardContainer}>
            {field.cards && field.cards.map((card, index) => {
                return <Card
                    key={card.id}
                    card={card}
                    isOwner={isOwner}
                    cardMore={cardMore}
                    onMoreClick={() => onMore({ cardId: card.id, fieldId: field.id })}
                    onDeleteClick={() => {
                        setCardMore({ ...cardMore, visible: false, cardId: "" });
                        onDeleteCard({ id: card.id, fieldId: field.id });
                    }}
                    onEditClick={() => setCardEditing({ ...cardEditing, editing: true, id: card.id })}
                    editing={cardEditing.editing && (cardEditing.id == card.id)}
                    onEditCancel={() => {
                        setCardEditing({ ...cardEditing, editing: false, id: "" });
                        setCardMore({ ...cardMore, visible: false, cardId: "" });
                    }}
                    onEditSubmit={({ title, desc, color }) => {
                        setCardEditing({ ...cardEditing, editing: false, id: "" });
                        setCardMore({ ...cardMore, visible: false, cardId: "" });
                        onEditCard({ title, desc, color, cardId: card.id, fieldId: field.id });
                    }}
                />
            })}
        </div>
        <div className={styles.addCardBtn}>
            {(isOwner && addingCard.fieldId != field.id) && <Button
                text="Add a card..."
                onClick={() => setAddingCard({ ...addingCard, fieldId: field.id, adding: true })}
                style={{ height: 48, borderRadius: 8, marginTop: 10, border: "none" }}
                icon={<AddIcon height={24} width={24} style={{ marginRight: 8 }} />}
            />}
        </div>
        {addingCard.adding && addingCard.fieldId == field.id && <AddCard
            onCancel={() => {
                setAddingCard({ ...addingCard, adding: false, fieldId: "" });
            }}
            onSubmit={({ title, desc, color }) => {
                setAddingCard({ ...addingCard, fieldId: "", adding: false });
                onAddCardToField({ fieldId: field.id, title, desc, color });
            }} />}
    </div>)
}

export default Field;