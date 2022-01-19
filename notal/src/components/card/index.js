import { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import styles from './Card.module.scss';

import Button from '../button';
import Input from '../input';

import MoreIcon from '../../../public/icons/more.svg';
import AddIcon from '../../../public/icons/add.svg';
import DragIcon from '../../../public/icons/drag.svg';
import EditIcon from '../../../public/icons/edit.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';
import UpIcon from '../../../public/icons/up.svg';
import DownIcon from '../../../public/icons/down.svg';

const Card = ({ card, isOwner, onMoreClick, cardMore, onDeleteClick, onEditClick, editing, onEditCancel, onEditSubmit, style, onCardUp, onCardDown, onCardDrop, fieldId, index }) => {

    // onCardDrop({ toCardId: card.id, cardId: item.card.id, fieldId: item.fieldId, toFieldId: fieldId });

    const [editCard, setEditCard] = useState({ title: card.title, desc: card.desc, color: card.color })

    return (
        <Draggable draggableId={card.id} index={index} isDragDisabled={editing}>
            {(provided) => (
                <div className={styles.todo}
                    style={{ ...style }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {editing != true ? <>
                        <div className={styles.content}>
                            <div className={styles.title}>
                                <div>
                                    <AddIcon height={24} width={24} style={{ marginRight: 8 }} />
                                </div>
                                <h1>{card.title}</h1>
                            </div>
                            <div className={styles.desc}>
                                {card.desc}
                            </div>
                        </div>
                        <div className={styles.controls}>
                            <div className={styles.color} style={{ backgroundColor: card.color }} />
                            {isOwner && <button className={styles.control}
                                onClick={() => onMoreClick()}>
                                <MoreIcon height={24} width={24} style={{ marginLeft: 2, marginRight: 2, }} />
                            </button>}
                            {isOwner && <button className={styles.control}>
                                <DragIcon height={24} width={24} style={{ marginLeft: 2, marginRight: 2, }} />
                            </button>}
                            {(cardMore.visible && cardMore.cardId == card.id) && <div className={styles.more}>
                                <button onClick={() => onCardUp({ cardId: card.id })}>
                                    <UpIcon height={24} width={24} />
                                </button>
                                <button onClick={() => onCardDown({ cardId: card.id })}>
                                    <DownIcon height={24} width={24} />
                                </button>
                                <button onClick={() => onEditClick()}>
                                    <EditIcon height={24} width={24} />
                                </button>
                                <button onClick={() => onDeleteClick()}>
                                    <DeleteIcon height={24} width={24} />
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
                            autoFocus
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
                                onClick={() => {
                                    onEditCancel();
                                    setEditCard({ ...editCard, title: card.title, desc: card.desc, color: card.color });
                                }}
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
                </div>
            )}
        </Draggable>
    )
}

export default Card;