import React, {useContext} from 'react';
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import TableHeader from "./table-header/table-header.component";
import {Empty} from "antd";
import TableRow from "./table-row/table-row.component";
import {BuyingPolicyPageCtx} from "../../pages/buying-policy-page/buying-policy-ctx";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const Rows = React.memo(function Rows({rows}) {
    return rows.map((row, index) => {
        return <TableRow row={row} index={index} key={row.key}/>;
    });
});

function BuyingPolicySummery() {

    const props = useContext(BuyingPolicyPageCtx);

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const newPolicy = reorder(
            props.policy,
            result.source.index,
            result.destination.index
        );

        props.setPolicy(newPolicy);
    }

    return (
        <div style={{height: "65vh", overflowY: "scroll"}}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <TableHeader/>
                <Droppable droppableId="list">
                    {provided => (
                        props.policy.length === 0
                            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                            : <div ref={provided.innerRef} {...provided.droppableProps}>
                                <Rows rows={props.policy}/>
                                {provided.placeholder}
                            </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default BuyingPolicySummery;
