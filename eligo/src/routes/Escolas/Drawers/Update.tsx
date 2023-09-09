import React from "react";

// import { Container } from './styles';

const Update: React.FC = () => {
  return (
    <Drawer anchor="right" open={updateDrawer} onClose={() => toggleUpdate(false)}>
      <Box p={2} width="320px" textAlign="center" role="presentation">
        <Typography variant="h5" component="div">
          Lorem Ipsum Dolor
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Update;
