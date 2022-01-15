import styles from './AddCard.module.scss';
import { useState } from 'react';

import Input from '../input';
import Button from '../button';

import AddIcon from '../../../public/icons/add.svg';
import CrossIcon from '../../../public/icons/cross.svg';

const AddCard = ({ onSubmit, onCancel }) => {

    const [addedCard, setAddedCard] = useState({ title: "", desc: "", color: "red" });

    return (<div className={styles.addCardWrapper}>
        <div className={styles.inputContainer}>
            <h1>Title</h1>
            <Input
                type="text"
                placeholder="Card Title"
                value={addedCard.title}
                onChange={e => setAddedCard({ ...addedCard, title: e.target.value })}
                style={{ width: "100%", marginTop: 8 }}
            />
        </div>
        <div className={styles.inputContainer}>
            <h1>Description</h1>
            <Input
                type="text"
                placeholder="Card Description"
                value={addedCard.desc}
                onChange={e => setAddedCard({ ...addedCard, desc: e.target.value })}
                style={{ width: "100%", marginTop: 8 }}
                multiline
            />
        </div>
        <div className={styles.inputContainer}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <h1>Color</h1>
                <div className={styles.color} style={{ backgroundColor: addedCard.color }} />
            </div>
            <select id="addCardColor" onChange={e => setAddedCard({ ...addedCard, color: e.target.value })}>
                <option value="red">red</option>
                <option value="blue">blue</option>
                <option value="green">green</option>
                <option value="orange">orange</option>
                <option value="yellow">yellow</option>
            </select>
        </div>
        <div className={styles.buttons}>
            <Button
                text="Cancel"
                icon={<CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                style={{ borderStyle: "none", height: 48, width: "48%" }}
                onClick={() => onCancel()}
                reversed
            />
            <Button
                text="Add"
                icon={<AddIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                style={{ borderStyle: "none", height: 48, width: "48%" }}
                onClick={() => onSubmit({ title: addedCard.title, desc: addedCard.desc, color: addedCard.color })}
            />
        </div>
    </div>)
}

export default AddCard;