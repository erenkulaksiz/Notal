import { Button, Text, Grid, Checkbox, Tooltip, Card, useTheme } from '@nextui-org/react';
import styled from 'styled-components';

import {
    DeleteIcon,
    EditIcon,
    MoreIcon
} from '../../icons';

const CardColor = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${props => props.color};
    z-index: 5;
    border-radius: 100%;
`;

const FieldCard = ({ card, onDelete, isOwner, onEdit }) => {
    const { isDark } = useTheme();

    return (<Grid xs={12} css={{ mt: 8, }} key={card._id}>
        <Card bordered css={{ width: "100%", }} shadow={false}>
            <Grid.Container>
                <Grid xs={10} sm={10}>
                    <Text h4>
                        {card.title}
                    </Text>
                </Grid>
                <Grid xs={2} sm={2} justify='flex-end' alignItems='center'>
                    <Checkbox size="xs" checked={false} css={{ mr: 8 }} disabled />
                    {card.color && <div style={{ marginRight: 14, marginBottom: 10, position: "relative" }}>
                        <CardColor color={card.color} />
                    </div>}
                    {isOwner && <Tooltip
                        css={{ pointerEvents: "none" }}
                        content={
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Button size="sm" css={{ minWidth: 44, mr: 4 }} onClick={() => onDelete({ id: card._id })}>
                                    <DeleteIcon size={24} fill={"currentColor"} />
                                </Button>
                                <Button size="sm" css={{ minWidth: 44 }} onClick={onEdit}>
                                    <EditIcon size={24} fill={"currentColor"} />
                                </Button>
                            </div>}>
                        <Button size="sm" css={{ minWidth: 44, "&:hover": { bg: isDark ? "$gray800" : "$gray200" } }} light>
                            <MoreIcon size={24} fill={"currentColor"} />
                        </Button>
                    </Tooltip>}
                </Grid>
                <Grid xs={12} css={{ wordBreak: "break-word" }}>
                    <Text>
                        {card.desc}
                    </Text>
                </Grid>
            </Grid.Container>
        </Card>
    </Grid>)
}

export default FieldCard;