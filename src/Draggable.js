import React, { useState } from 'react';
import { DraggableCore } from 'react-draggable';
import clamp from 'lodash/clamp';

function calculateClampedValue(value, delta, slack, min, max) {
  return clamp(value + delta + slack, min, max);
}

function calculateSlack(value, delta, slack, clampedValue) {
  return slack + value + delta - clampedValue;
}

function Draggable(props) {
  const { children } = props;
  const [position, setPosition] = useState('');
  const [left, setLeft] = useState(50);
  const [right, setRight] = useState(250);
  const [leftSlack, setLeftSlack] = useState(0);
  const [rightSlack, setRightSlack] = useState(0);

  const width = right - left;

  const onDragStart = (event) => {
    setPosition(event.target.dataset.position);
  };

  const onDrag = (event, data) => {
    const { deltaX } = data;

    if (position === 'left') {
      const leftMin = 0;
      const leftMax = right - 60;

      const clampedLeft = calculateClampedValue(left, deltaX, leftSlack, leftMin, leftMax);
      const newLeftSlack = calculateSlack(left, deltaX, leftSlack, clampedLeft);

      setLeft(clampedLeft);
      setLeftSlack(newLeftSlack);
    }

    if (position === 'right') {
      const rightMin = left + 60;
      const rightMax = 900;

      const clampedRight = calculateClampedValue(right, deltaX, rightSlack, rightMin, rightMax);
      const newRightSlack = calculateSlack(right, deltaX, rightSlack, clampedRight);

      setRight(clampedRight);
      setRightSlack(newRightSlack);
    }

    if (position === 'center') {
      const leftMin = 0;
      const leftMax = 900 - width;
      const rightMin = 0 + width;
      const rightMax = 900;

      const clampedLeft = calculateClampedValue(left, deltaX, leftSlack, leftMin, leftMax);
      const newLeftSlack = calculateSlack(left, deltaX, leftSlack, clampedLeft);
      const clampedRight = calculateClampedValue(right, deltaX, rightSlack, rightMin, rightMax);
      const newRightSlack = calculateSlack(right, deltaX, rightSlack, clampedRight);

      setLeft(clampedLeft);
      setLeftSlack(newLeftSlack);
      setRight(clampedRight);
      setRightSlack(newRightSlack);
    }
  };

  const onDragStop = () => {
    setPosition('');
    setLeftSlack(0);
    setRightSlack(0);
  };

  const style = {
    position: 'absolute',
    top: 0,
    left,
    width,
    height: 40
  };

  return (
    <DraggableCore
      onStart={onDragStart}
      onDrag={onDrag}
      onStop={onDragStop}
      handle=".handle"
    >
      <div style={style}>
        {children}
      </div>
    </DraggableCore>
  )
}

export default Draggable;
