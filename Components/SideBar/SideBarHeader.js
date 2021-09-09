import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeRoundedIcon from '@material-ui/icons/DonutLargeRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { auth } from '../../config';
import { signOut } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));
function SideBarHeader() {
  const [user] = useAuthState(auth);
  const classes = useStyles();
  return (
    <header
      style={{ background: '#76c2b8' }}
      className="flex items-center justify-between  px-2 py-4"
    >
      <Avatar className={classes.large} src={user.photoURL} />
      <div className="flex gap-1">
        {/* <IconButton>
          <DonutLargeRoundedIcon />
        </IconButton>
        <IconButton>
          <ChatIcon />
        </IconButton>

        <IconButton>
          <MoreVertIcon />
        </IconButton> */}
        <IconButton
          onClick={() => {
            signOut(auth);
          }}
        >
          <ExitToAppIcon />
        </IconButton>
      </div>
    </header>
  );
}

export default SideBarHeader;
