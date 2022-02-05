import { Text, Card } from '@nextui-org/react';

import AddIcon from '../../../public/icons/add.svg';

const WorkspaceAddField = ({ onClick }) => {
    return (<Card
        css={{ dflex: "center", borderColor: "$primary", color: "$primary", bg: "transparent", pb: 16, pt: 16, ml: 8, mt: 5, minWidth: 300, maxWidth: 400 }}
        bordered
        clickable
        onClick={onClick}
        shadow={false}
    >
        <AddIcon size={24} fill={"currentColor"} />
        <Text h4 css={{ color: "$primary" }}>
            Add a field
        </Text>
    </Card>)
}

export default WorkspaceAddField;