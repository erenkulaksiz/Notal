import { Button, Text, Grid, Card, Tooltip, useTheme } from '@nextui-org/react';

import {
    DeleteIcon,
    EditIcon,
    MoreIcon,
    AddIcon,
    FilterIcon
} from '../../icons';

import FieldCard from '../fieldCard';

const Field = ({ field, onAddCard, onDeleteField, onDeleteCard, onEditClick, onEditCard, isOwner }) => {
    const { isDark } = useTheme();

    return (<Grid css={{ minWidth: 420, maxWidth: 450, }}>
        <Card css={{ boxShadow: "$sm" }}>
            <div style={{ display: "flex" }}>
                <Grid.Container>
                    <Grid xs={12} css={{ position: "sticky", top: 0, zIndex: "$3" }}>
                        <Card bordered shadow={false}>
                            <Grid.Container>
                                <Grid xs={isOwner ? 6 : 12} sm={isOwner ? 6 : 12}>
                                    <Text h4>
                                        {field.title}
                                    </Text>
                                </Grid>
                                {isOwner && <Grid xs={6} sm={6} css={{ justifyContent: "flex-end" }}>
                                    <Tooltip content="Filter" css={{ pointerEvents: "none" }}>
                                        <Button size="sm" css={{ minWidth: 44, "&:hover": { bg: isDark ? "$gray800" : "$gray200" }, mr: 4 }} light>
                                            <FilterIcon size={24} fill={"currentColor"} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip
                                        content={
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <Button size="sm" css={{ minWidth: 44, mr: 4 }} onClick={onDeleteField}>
                                                    <DeleteIcon size={24} fill={"currentColor"} />
                                                </Button>
                                                <Button size="sm" css={{ minWidth: 44, }} onClick={onEditClick}>
                                                    <EditIcon size={24} fill={"currentColor"} />
                                                </Button>
                                            </div>}>
                                        <Button size="sm" css={{ minWidth: 44, "&:hover": { bg: isDark ? "$gray800" : "$gray200" } }} light>
                                            <MoreIcon size={24} fill={"currentColor"} />
                                        </Button>
                                    </Tooltip>
                                </Grid>}
                            </Grid.Container>
                        </Card>
                    </Grid>

                    {field?.cards && field?.cards.map((card, index) => <FieldCard
                        key={card._id ? card._id : index}
                        card={card}
                        onDelete={({ id }) => onDeleteCard({ id })}
                        onEdit={() => onEditCard({ card, fieldId: field._id })}
                        isOwner={isOwner}
                    />)}

                    {isOwner && <Grid xs={12} css={{ mt: 8 }}>
                        <Card
                            css={{ dflex: "center", borderColor: "$primary", color: "$primary", bg: "transparent" }}
                            bordered
                            clickable
                            onClick={onAddCard}
                            shadow={false}
                        >
                            <AddIcon size={24} fill={"currentColor"} />
                            <Text h4 css={{ color: "$primary" }}>
                                Add a card
                            </Text>
                        </Card>
                    </Grid>}
                </Grid.Container>
            </div>
        </Card>
    </Grid>)
}

export default Field;