import classNames from 'classnames/bind';
import styles from './CompleteOrder.module.scss';
//
import React, { useState, useEffect } from 'react';
import { apiUrl, cookieValue, socket } from '../../../contexts/contexts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CardOrder from '../../../components/Layout/components/OrderKitchen/CardOrder';
//
const cx = classNames.bind(styles);

const CompleteOrder = () => {
  const [DataOrder, setDataOrder] = useState([]);
  //reload
  const [reload, setreload] = useState(true);
  //==========================================

  useEffect(() => {
    socket.on('statusOrderK', (data) => {
      setreload(!reload);
    });
  }, [reload]);

  useEffect(() => {
    axios
      .get(apiUrl + '/v1/do-order-k', {
        headers: {
          token: cookieValue(),
        },
      })
      .then((res) => {
        setDataOrder(res.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, [reload]);
  //==========================================
  //rander ui
  const listOrder = DataOrder.map((data) => {
    return (
      <div key={data._id}>
        <CardOrder billCode={data.codeBill} Time={data.createdAt} status={data.status} />
      </div>
    );
  });
  //==========================================
  return <div className={cx('container1')}>{listOrder}</div>;
};

export default CompleteOrder;
