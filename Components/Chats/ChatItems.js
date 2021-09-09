import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { photoActions } from '../Store/PhotoModal';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RemoveRedEyeTwoToneIcon from '@material-ui/icons/RemoveRedEyeTwoTone';
function ChatItems({
  ownText,
  data,
  id,
  isRead,
  timestamp,
  type,
  scrollToBottom,
  filename,
}) {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const interval = setTimeout(() => {
      scrollToBottom();
    }, 500);
    return () => {
      clearTimeout(interval);
    };
  }, [scrollToBottom]);
  const imageShowHandler = () => {
    dispatch(
      photoActions.setShowModalHandler({
        url: data,
        showModal: true,
        id: id,
      })
    );
  };
  const content = () => {
    if (type === 'text') {
      return (
        <p
          className="text-md overflow-wrap px-1 "
          style={{ wordWrap: 'break-word' }}
        >
          {data}
        </p>
      );
    } else if (
      type === 'audio' ||
      type === 'audio/mp3' ||
      type === 'audio/m4r' ||
      type === 'audio/mpeg'
    ) {
      return <audio src={data} controls="controls" />;
    } else if (
      type === 'image/png' ||
      type === 'image/jpg' ||
      type === 'image/jpeg' ||
      type === 'image/jpeg' ||
      type === 'image/gif'
    ) {
      return (
        <embed
          onClick={imageShowHandler}
          alt="img"
          src={data}
          type={type}
          controls="controls"
          className="w-52 object-cover	"
        ></embed>
      );
    } else if (type === 'application/pdf') {
      return <embed type={type} src={data}></embed>;
    } else if (type === 'video/mp4') {
      return (
        <video
          src={data}
          className="w-60 object-cover	"
          controls="controls"
        ></video>
      );
    } else {
      return (
        <a className="text-blue-500 " href={data}>
          {filename}
        </a>
      );
    }
  };

  return (
    <div
      style={{
        width: 'fit-content',
        // backgroundColor: ownText ? '#dcf8b1' : '',
        backgroundColor: ownText ? '#f4ffe4' : '#fff7cd',
      }}
      className={`relative rounded-xl ${
        ownText
          ? 'rounded-tr-none float-right ml-auto  font-bold'
          : 'rounded-tl-none'
      }  bg-white max-w-xl  py-1 px-2 `}
    >
      <div className="flex  flex-col justify-center">
        {content()}

        <div>
          {ownText && isRead && (
            <RemoveRedEyeTwoToneIcon
              style={{ fontSize: '12px' }}
              className=" float-right mt-1 ml-1"
            />
          )}
          {ownText && !isRead && (
            <CheckCircleOutlineIcon
              style={{ fontSize: '12px' }}
              className=" float-right mt-1 ml-1"
            />
          )}

          <span
            style={{ fontSize: '11px' }}
            className="float-right relative  text-gray-700"
          >
            {moment(timestamp).format('h:mm a, MMM D')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatItems;
//       marginLeft: ownText ? 'auto' : '',
// backgroundColor: ownText ? '#dcf8c6' : 'white',
