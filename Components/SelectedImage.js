import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { photoActions } from './Store/PhotoModal';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
const SelectedImage = () => {
  const dispatch = useDispatch();
  const photoModal = useSelector((state) => state);

  const backdropCloseHandler = (event) => {
    if (event.target.classList.contains('backdrop')) {
      dispatch(
        photoActions.setShowModalHandler({
          url: '',
          showModal: false,
          id: '',
        })
      );
    }
  };
  const deletePhotoHandler = () => {
    dispatch(
      photoActions.setShowModalHandler({
        url: '',
        showModal: false,
        id: '',
      })
    );
  };
  return (
    <div>
      <motion.div
        style={{ backgroundColor: 'rgba(0,0,0,0.7 )' }}
        className="backdrop w-full fixed top-0 left-0 h-full mx-auto    z-20 "
        onClick={backdropCloseHandler}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className=" mx-auto w-1/12 text-center mt-16">
          <span className="mx-auto ">
            <motion.div
              initial={{ y: '-100vh' }}
              animate={{ y: 0 }}
              transition={{ delay: 0 }}
              onClick={deletePhotoHandler}
              // className="    mb-4 mx-auto   px-2 py-1 cursor-pointer  text-green-300 font-bold z-100  text-3xl"
            >
              <IconButton>
                <CloseIcon style={{ fontSize: 40 }} className="text-white  " />
              </IconButton>
            </motion.div>
          </span>
        </div>
        <motion.img
          className=" mx-auto  object-cover"
          style={{
            maxHeight: '70%',
            maxWidth: '70%',
            border: '1px solid white',
            boxShadow: '3px 4px 5px rgba(0,0,0,0.5)',
          }}
          src={photoModal.url}
          initial={{ y: '-100vh' }}
          animate={{ y: 0 }}
          transition={{ delay: 0 }}
        ></motion.img>
      </motion.div>
    </div>
  );
};
export default SelectedImage;
