import { useEffect, useRef } from 'react';

export const AlwaysScrollToBottom = ({ msgs }) => {
  const elBottom = useRef();
  useEffect(() => {
    elBottom.current.scrollIntoView();
  }, [msgs]);
  return <div ref={elBottom}></div>;
};
