import classNames from 'classnames/bind';
import styles from './ClientBill.module.scss';
//input localhost file
import axios from 'axios';
import { apiUrl, cookieValue, numberFormat } from '../../../contexts/contexts';
import { useEffect, useState } from 'react';
import Header from '../../../components/Client/Header/Header';
import moment from 'moment';
//
const cx = classNames.bind(styles);

const ClientBill = () => {
  const [Allbill, setAllbill] = useState([]);
  const [dataFood, setdataFood] = useState([]);
  //=====================================
  useEffect(() => {
    const test = (am, bm) => {
      setdataFood([]);
      let result = am.concat(bm).reduce((a, c) => {
        let obj = a.find((i) => i.IDnumber === c.IDFood);
        if (obj) {
          obj.count += c.quantity;
        } else {
          a.push(c);
        }
        return a;
      }, []);
      setdataFood((d) => d.concat(result));
    };
    const url = window.location.href.split('/');
    axios
      .post(
        apiUrl + '/v1/get-detail-order-by-idNtable',
        { tableNumberID: url[5] },
        {
          headers: {
            token: cookieValue(),
          },
        },
      )
      .then((res) => {
        setAllbill(res.data.data[0]);
        test(res.data.data[0].Food, res.data.data[0].OrderNumberIDFood);
      })
      .catch((error) => {});
  }, []);
  //=====================================
  //rander ui
  //rander menu
  const listMenu = dataFood.map((data) => {
    return (
      <tr key={data._id}>
        <td className={cx('container-table-td')}>{data.NameFood}</td>
        <td className={cx('container-table-td')}>{data.count}</td>
      </tr>
    );
  });
  //=====================================
  return (
    <div>
      <Header />
      <div className={cx('wrapper')}>
        <div className={cx('container1')}>
          <div className={cx('container-infor')}>
            <h3>Thông tin bàn</h3>
            <p>Thời gian: {moment(Allbill.createdAt).locale('vi').format('HH:mm DD/MM/YYYY')}</p>
            <p>Mã hóa đơn: {Allbill.codeBill}</p>
          </div>
          <h3>Thông bill</h3>
          <table className={cx('container-table')}>
            <tbody>
              <tr>
                <th className={cx('container-table-th')}>Tên món</th>
                <th className={cx('container-table-th')}>Số lượng</th>
              </tr>
              {listMenu}
            </tbody>
          </table>
          <h3>Thành giá: {numberFormat.format(Allbill.amount)}</h3>
        </div>
      </div>
    </div>
  );
};

export default ClientBill;
