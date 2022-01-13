import styles from './Card.module.scss';

import MoreIcon from '../../../public/icons/more.svg';
import AddIcon from '../../../public/icons/add.svg';
import DragIcon from '../../../public/icons/drag.svg';
import EditIcon from '../../../public/icons/edit.svg';
import DeleteIcon from '../../../public/icons/delete.svg';

const Card = ({ card, key, isOwner, onMoreClick, cardMore, onDeleteClick, onEditClick, editing }) => {

    return (<div className={styles.todo} key={key}>
        <div className={styles.content}>
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
        </div>
    </div>)
}

export default Card;