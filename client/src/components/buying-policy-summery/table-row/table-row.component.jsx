import React from 'react'
import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import {Button, Popconfirm, Space} from "antd";

const Row = styled.div`
  width: 100%;
  border-bottom: 1px solid grey;
  margin-bottom: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;
const basicStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "14.2%",
    alignItems: "center"
};

function TableRow({index, discount}) {
    const handleRemove = (props) => {
    };

    const handleEditMode = ({moveToScreen, setMode, setCondition}) => {
    };

    const getActions = (props) => {
        return (
            <Space>
                <Popconfirm title="Are you sure delete this discount from the policy?"
                            onConfirm={() => handleRemove(props)}><a
                    href="#">delete</a></Popconfirm>
                <Button type="link" onClick={() => handleEditMode(props)}>edit</Button>
            </Space>
        );

    }

    return (
        <Draggable draggableId={discount.key} index={index}>
            {provided => (
                <Row
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <span style={basicStyle}>actions</span>
                    <span style={basicStyle}>lalal1</span>
                    <span style={basicStyle}>lala2</span>
                    <span style={basicStyle}>lala3</span>
                    <span style={basicStyle}>lala4</span>
                    <span style={basicStyle}>lala5</span>
                    <span style={basicStyle}>lala6</span>
                </Row>
            )}
        </Draggable>
    );
}

export default TableRow;


