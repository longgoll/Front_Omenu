import classNames from 'classnames/bind';
import styles from './ClientMenu.module.scss';
//components
import CardFood from '../../components/Client/CardFood/CardFood';
//react dom
import { useNavigate } from 'react-router-dom';
//input localhost file
import axios from 'axios';
import { apiUrl, cookieValue } from '../../contexts/contexts';
import { useEffect, useState } from 'react';
import Header from '../../components/Client/Header/Header';
//
const cx = classNames.bind(styles);

const ClientMenu = () => {
  let navigate = useNavigate();
  //usestas
  const [dataFood, setdataFood] = useState([]);
  const [dataFoodNew, setdataFoodNew] = useState([]);
  const [dataFoodHot, setdataFoodHot] = useState([]);
  const [dataCategory, setdataCategory] = useState([]);
  const [StatusTable, setStatusTable] = useState(false);
  const [dataTable, setdataTable] = useState([]);
  //data fields
  const [fieldCategory, setfieldCategory] = useState('0');
  //=============================================
  //lấy trạng thái bàn
  useEffect(() => {
    const url = window.location.href.split('/');
    axios
      .get(apiUrl + '/v1/get-detail-table/' + url[4], {
        headers: {
          token: cookieValue(),
        },
      })
      .then((res) => {
        setStatusTable(res.data.data.StatusTable);
        setdataTable(res.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
    //lấy dữ liệu category
    axios
      .get(apiUrl + '/v1/get-all-category', {
        headers: {
          token: cookieValue(),
        },
      })
      .then((res) => {
        setdataCategory(res.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

  //lấy dữ liêu món ăn
  useEffect(() => {
    //thay đổi bộ lọc
    if (fieldCategory === '0') {
      //lấy món mới
      axios
        .post(
          apiUrl + '/v1/get-all-food-tagb',
          {
            typeN: 'FoodNew',
            value: true,
          },
          {
            headers: {
              token: cookieValue(),
            },
          },
        )
        .then((res) => {
          setdataFoodNew(res.data.data);
          //   console.log(res.data.data);
        })
        .catch((error) => {
          // console.log(error);
        });
      //lấy món hot
      axios
        .post(
          apiUrl + '/v1/get-all-food-tagb',
          { typeN: 'FoodHot', value: true },
          {
            headers: {
              token: cookieValue(),
            },
          },
        )
        .then((res) => {
          setdataFoodHot(res.data.data);
        })
        .catch((error) => {
          // console.log(error);
        });
      //lấy tất cả đồ ăn
      axios
        .get(apiUrl + '/v1/get-all-food', {
          headers: {
            token: cookieValue(),
          },
        })
        .then((res) => {
          setdataFood(res.data.data);
        })
        .catch((error) => {
          // console.log(error);
        });
    } else {
      axios
        .post(
          apiUrl + '/v1/get-all-food-by-category',
          {
            CategoryFood: fieldCategory,
          },
          {
            headers: {
              token: cookieValue(),
            },
          },
        )
        .then((res) => {
          setdataFood(res.data.data);
          // console.log(res.data);
        })
        .catch((error) => {
          // console.log(error);
        });
    }
  }, [fieldCategory]);
  //==============================================
  const NextPageCart = () => {
    const url = window.location.href.split('/');
    navigate('/client-cart/' + url[4]);
  };

  //xem bill
  const NextPageBill = () => {
    const url = window.location.href.split('/');
    navigate('/client-bill/' + url[4] + '/' + dataTable.IDnumber);
  };

  //xem  trạng thái đơn
  const NextPageBillStatus = () => {
    const url = window.location.href.split('/');
    navigate('/client-bill-status/' + url[4] + '/' + dataTable.IDnumber);
  };

  //thêm món
  const NextPageAddFood = () => {
    const url = window.location.href.split('/');
    navigate('/client-add-food/' + url[4] + '/' + dataTable.IDnumber);
  };
  //==============================================
  //rander ra ui
  //món mới
  const listFoodNew = dataFoodNew.map((data) => {
    return (
      <div key={data._id}>
        <CardFood
          NameFood={data.NameFood}
          Price={data.Price}
          FoodHot={data.FoodHot}
          FoodNew={data.FoodNew}
          data={data}
        />
      </div>
    );
  });
  //món hot
  const listFoodHot = dataFoodHot.map((data) => {
    return (
      <div key={data._id}>
        <CardFood
          NameFood={data.NameFood}
          Price={data.Price}
          FoodHot={data.FoodHot}
          FoodNew={data.FoodNew}
          data={data}
        />
      </div>
    );
  });
  //danh sách món ăn
  const listFood = dataFood.map((data) => {
    return (
      <div key={data._id}>
        <CardFood
          NameFood={data.NameFood}
          Price={data.Price}
          FoodHot={data.FoodHot}
          FoodNew={data.FoodNew}
          data={data}
        />
      </div>
    );
  });

  //danh sách category
  const selectCategory = dataCategory.map((data) => {
    return (
      <option key={data._id} value={data.IDnumber}>
        {data.categoryName}
      </option>
    );
  });

  return (
    <>
      <Header />
      <div className={cx('wrapper')}>
        {StatusTable ? (
          <div className={cx('container-main')}>
            <div className={cx('container-tool')}>
              <h1>Menu</h1>
              <button className={cx('btn')} onClick={NextPageAddFood}>
                Thêm món
              </button>
              <button className={cx('btn')} onClick={NextPageBillStatus}>
                Trạng thái đơn
              </button>
              <button className={cx('btn')}>Gọi nhân viên</button>
              <button className={cx('btn')} onClick={NextPageBill}>
                Xem bill
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={cx('container-infor')}>
              <label>Bộ lọc</label>
              <select className={cx('select-filters-ch')} onChange={(e) => setfieldCategory(e.target.value)}>
                <option value="0">Tất Cả</option>
                {selectCategory}
              </select>
              <button className={cx('btn')}>Gọi nhân viên</button>
              <button onClick={NextPageCart} className={cx('btn')}>
                Giỏ hàng
              </button>
            </div>
            {/* ====================== */}
            <h3 className={cx('container-title')}>
              {fieldCategory === '0' && listFoodHot.length > 0 ? 'Món mới' : <></>}
            </h3>
            <div className={cx('container1')}>
              {listFoodNew.length > 0 && fieldCategory === '0' ? listFoodNew : <></>}
            </div>
            {/* //==================== */}
            <h3 className={cx('container-title')}>
              {fieldCategory === '0' && listFoodHot.length > 0 ? 'Món Hot' : <></>}
            </h3>
            <div className={cx('container1')}>
              {listFoodHot.length > 0 && fieldCategory === '0' ? listFoodHot : <></>}
            </div>
            {/* //==================== */}
            <h3 className={cx('container-title')}>{fieldCategory === '0' ? 'Tất cả món' : <></>}</h3>
            <div className={cx('container1')}>{listFood.length > 0 ? listFood : 'Không có dữ liệu'}</div>
          </>
        )}
      </div>
    </>
  );
};

export default ClientMenu;
