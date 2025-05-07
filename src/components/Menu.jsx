
import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import CartPage from './CartPage';

function Menu({ cart, setCart, selectedTableId, handleRemoveFromCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuItemQuantities, setMenuItemQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const menuItems = [
    { id: 1, name: 'Burger', price: 10.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPSeTcovk3SJiHmv81v78chwKW4j1LbGnf9A&s' },
    { id: 2, name: 'Fries', price: 4.99, image: 'https://cdn.pixabay.com/photo/2017/11/04/02/27/friench-fries-2916301_1280.jpg' },
    { id: 3, name: 'Salad', price: 7.99, image: 'https://cdn.pixabay.com/photo/2015/01/19/22/41/salad-604999_1280.png' },
    { id: 4, name: 'Pizza', price: 14.99, image: 'https://cdn.pixabay.com/photo/2024/03/15/16/25/pizza-8635314_1280.jpg' },
    { id: 5, name: 'Chicken Wings', price: 12.99, image: 'https://cdn.pixabay.com/photo/2023/07/19/21/08/fried-8137874_1280.png' },
    { id: 6, name: 'Biryani', price: 14.99, image: 'https://as1.ftcdn.net/v2/jpg/05/66/68/36/1000_F_566683685_ki6zDMAsQxTelrthSbqPH2fFezqvII1l.jpg' },
    { id: 7, name: 'Tacos', price: 19.99, image: 'https://media.istockphoto.com/id/459396345/photo/taco.jpg?s=612x612&w=0&k=20&c=_yCtd6OEb2L8xNal4kC1xvm8HoBp8sry6tcBwmxmPHw=' },
    { id: 8, name: 'Fish Fry', price: 29.99, image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAzgMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABAECAwUGBwj/xAA7EAABAwMCBAMFBwMDBQEAAAABAAIDBAUREiEGMUFRE2FxFCIyQqEHFSOBkbHRM2LwcoLBQ1JTdLI1/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAMEBQIBBv/EACQRAAICAgMAAQQDAAAAAAAAAAABAgMEERIhMSIFE0FxFCNh/9oADAMBAAIRAxEAPwD3FERAEREAREQBERAEREAREQBERAEREAREQBEVCQOaAqiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiomUBVFp73xFbbJEXVs/4mMiFh1PP5LmbH9oP3jfm0lTTx01NN7kJDtTg7pqPLf6HChlkVxlxb7GjvkVocqZ81MC9aC+XGGKqjglnZG0cy52nJ6DK201XFCxznvaABk7rwDjriZl7vshp/wASihBDcux4h6kD6BV7rNLSLeJjytmfQNG/XSxOJydPPusy8T+z77TYrU1lo4ikcaYf0KvJJjGfhf1x/d06r2UVUTmB0cjXBwy0h2QR3U0JckQ3VSrk0zPlMqKZ8q5kuSuiIkAqqsacq8IAiIgCIiAIiIAiKxz8bdUBeqEgLES49VY445rzZ7oz6291TxG9Fyd045s9uNWx7nSPptA0x4JkLs7N74xuuHv/ANqVVVtMVohfTw/PJgOkH6fCopXxXhOsW1/g9RvPEFus8WquqGsd0iBy93oF59fePrjWtcy2MbRw4xq+KVw/YLzqqulbPN4kWZJDlz3vYXE7dSSozrxLlzKkAlg94AYA/JULbbrPOkTPBui+0bpkrJHOkla+SZ+7vEeXEnuT1VTqaRqLYmu9dv0XPzXGtji91rWNJxlp/wCVYLpVRnwpWxnAy5zxvn1VX+NN9nTw7V20e7cH8TC5Ufsj5XPqaZoBc4YMjf8Au/lU4t4khttvmYKmOOqfC8xMc7dxxtgeuF4pR3a60sntFLN4czDhulozjv6eqoaesujZq6snkbAwjXVyHVk9gOZJ7Kz/AG8dNlqrEUdSmilTe7qJJGtudUWTNLSDISMHnzWpn92UASNLR22+i2ss1pIzJTV0xxp8UTNadv7cbfmo76WCrlb7BI6Zwb7sErdLyB2I2cfLYqWK6LtkuPiNZI0FzTjB8+oXpn2TTXNnixv9pdbcgsDmvLWnrpPLHLYLni2hsFVHBFT09deHMa95f70FJkZA0/M/l5LprXUVtY8PrKqaU9Gk4aPRo2CmhXJoy8rJg3xS2ekCoOr3C7/c7K29MSWgnnhc1ZmHDQV09M3DVZjHXRnN7JcayBWMV66OQiIgCIiAKixyTwxODZZWMJ3AccZUGqvlppRme40rOv8AUBK4c4x9Y02T3v09QoTrjRtikk9piIjzrxIPdx3XjPEvEk1TdTJLUGrpBNiIt90AeQ26dVzMJ8SOWpmALnOLtJ+IDO2T6Kq8p96XRsV/Sm1Hcu2eqXf7Sooqh9Pb6RzttppzpafMDmQuPvHHN/qM6K3RATygaGfXmuSkrJXTMB8QsYMDJ5A9O6z0jDXv9nc1viaT4Rc47nyPUqGdk9bfhpV4ePDpLtEaerbNhzmFpwdX674VsdNNI976eQgNZ72H8vzSst9VSyYLHB7ck6tsKjXTth0ys0N7EYDjz5fVeLWtxZPylN8ZIp95A08UL4Wsc0EucwEE9gc81aIW1EuoPyXg5adiNufopcrLc6hZE4D2nOTIHnfPcdwrKSgg8Y4me/GdJA5jvkLxOOuuhwsUu+0R6Gs9hl8KoZ41I44cCOQzzHZVqKeEMbUUr3GKQlrGTMGeeNvRbGCzVtdGaeip6io2cHOZHtkct+Xbr0WruNur6BrmV8E1MQMYkaQPTK6ST78IJpb4my4f4YuNzjkfGWU8DXFj3zb5I22C6a5cJ3RvDVNS0RjnNPUOqCWuwZMg/XdX8Q+FZ7PbIyJqmA07CyEShokJG7nH+Op9VdwldKGWsFLb2PtlQ4ZY0SF0Mv8Abg8j6LjcnLZDp8do86lElLUPgqIZIqhhOWvG4813v2dWcye3XuqaQKRhEWg/E8buP7D8yug4rs9u4rtNTu2ludC4B7y3JYDuc9wQpNgrqey8P09lAZVP0OjaWf8AVySdh6KSTS9IpZE5w4pHEXuztpL6KiMNHtkbZXhvRxG/8rpbFTHLSVhdTzXO5unkYW4OlrOy6q127w28ir1W+C2Yt2ub0bW2MDWjvlb6A7BaylhLGjZbGEbBSERLYVkCwN5rKOSAuREQBERAajiO1/eVue1gHjx5fEfPt+fJeOX2XwYHRRtLXY3d059fNe8HkvHPtNhpKTiLDTltTH4jo25y1/U/mN8LKz8ZSkrV+C1iV/dsUDkqiCPXTtEjXRNaTkZ3JxvyUSowwZjeAMe8O5Wwmkp2gO8N5LowCX9CPlx2K1Uj8txgHc46Hl1x5qCLZ9fClJ/4Ynl8Ry7JYMbNPInupkNNHU1ccXhvaZRjBGOnP6ZyqxUhnYx2wBP4QcM8huFDtE/hVklunJbM5wdHIPlaM5apFuSbXqO7JKDSa6ZsX1lRTB1INUsJOkvcQ5zemAev/KhSysLpZKYtMjAdY0+5j07rdeDQeDVvq2TCr3MbWM9zI+uPJaiF2J3gxa9WxactJIzk56bd1HW099HDWn8SzViFmWMfG/d2obtBGxwOnJbzg7hdt1n+8KnXHSRks0a8e0OHPf5W8srTvjbFNCGAMcf6uonDdts/wur4jqDTfZ/Z46V5Yyp0tlc04Lstc45P+rCsQKuU5JJL1speuMabxH0ljpaaohgGHzTZ8IeTIwRkeZKycP30cQtfQXWggjhkPhxyxtwxzhvpLCT+q4xtMKKMMJiDXEh2Dy6ZI/hLdI514pIqN73Tyztc0NJGr3hk46bI5OfSInjwqhubO14t4cmrLTDTW9+au2sIjhPOWHsD3GNl5nC+pqK5kNOJYTCdZ906muBzt23C9e47vruH5aB8MDKh00miaBxI1MLdyCNwc43UeK9W0sfUQ01aJAM5mkbpae2oe8fquXY4LzszrMjrhy0mSrw5lLZ6m5lxZW19FFTaAd3vGf21Fc/ZOHp5hCwamOa3Bk5n8ltLfSPulW2eoL5X/K6Qn3R/aOQ/dd/ZrW2KMDAXVeNO1p2dIzrLe9RIdmshhia2Q68cjjB6c/Nb+KjY1S4oQAMD9FlDAtOK0tFdvZGbCB0WRrccgs2gKulegsa1ZAqogCIiAIiIDBVvdFTyyNaXOa0kNHU4XhF7knuFYauvd+K/m53yt8h0Xute4so53N5iNxH6LwGaqE0hjeTqb8ThuqObyaWje+h/bU5c1+iLK2SaYNjeJGDZpPXbqsFPSOnrCyLm3BDtQyf88lvKWWmgGmUBzXjB3OWc9+X+ZVksL5Cyd2ImNaTGHHScHr5fuszk10z6jafi0WV8NO20vjGMhwdGQcHJ5fUriAX27iiIzTF+o6Xlu5Adsulrb5BHTt8ZwkaD0dkkfyuIldJPUzV72hpLtbW8uqt4VUkny8Zh/VsiEOME/lvZ21DL7aIy5r2uMhAw4jW0Hkf87LFcAQ8yRHSS4NAcc6tx3UWnm8WOkeG4GJQxwbu45yPXn9FkqLlMyMtOPFa7ADhgk53wOi848ZaLVeR9yCk2Y3GQSgvILHk6nNccv/gei6ylpTxJwpLb4naaqmf4tKyQaQQDjAPbcjyz5rgpZpmzFjWk6mb7aSCe56Bb+0WLiK6vhdaoaqMxnV40LC0Z5fGcBScdNMz8jMpUZRfTK0nAnE9yqXvqvCp4nbHxJQS4eWP3XccK8KW3hd5rHvZU1xGkSfFoz0bnr6KTHNJaogzia/0McrRnwIWCaoP6cvXCgz8VySP8Ph6hdCeXttV78v8Atbyb/my7ULZ+LSMqV8H8pNtmG/W+mjuDrxxTO9rCD7Hb495njqcfID3K1kclReKiPMDKakYfwqaL4W+ZPzO/uP0U2h4fnq53VNW6SaokOXyyElx/MrsLVYWxFvu8vJW4Uxh+ynObm9su4et/hsb7uMLsYGaQBhRaKkbC0YC2DGqU4L2q5UAVUAREQBERAEREAREQEerGuCRg5lpAXgUdJUw1E4khLfxXNJfsGkHr1x5r36ZwY8F3wnYqDW2ugrWmOspWyg88t5/mq99bmtIuYWSsefLR5Rbau1QUbqt9N7RLEwl5eCdZ2/IBR+JKe61cXix00DG+EXuZGdW2OQwf5Xc8S2fh2jpQ2oq2W4DJDWvJc7bo0brjo+JLVa43R2mgq7lKeVRcHlrB/pZk/wDCzI4Fqs2adn1Kvi5pvkedR0bpJ43y+9FCxx0OGQTggD9f2W2oeAr9fHsbSUkjWOw50j8NAHTnhS6hldX1UlSY4ad8kniFtMzQ0HyHRbGiF7p3a4LpXRu7tnd/K0IVWJ/JmG5uUnKXbN5ZvsfqII4m11wj/DOoNxrxnnjYLf0f2UWWny6pqamUk6nEYZv+mVAtPFPEVM0NqZI6xo/8zAHfq3H1Cn3Die63CkfTwwx0oeNLnsJLgPLspXTBvbO/5FqWkzj6682q0XCan4Z4fo3mJxa2trdUpeRzIbkbfmolVeOJLwNFVcZmxdIoPwmfo1bum4faDsxbuhsQHyKSMIx8RE5OT2zj7Xw3l2dG5OSe5XbWnh9rGt93C3tBamR/KtzBTtYAAAujwhUlsZEB7q2EcDW8gs4bhXYQFgZhXgKqIAiIgCIiAIiIAiIgCIiAxyx62kHkVpbhS1ToiyCpmjB6Nfhb5Y3xg9AgPMqvhTVI57gXOJ3LtysLOGhGfh+i9NdTsPNoUeSkaeQ3QHDwWJo+UKbHZWAfAF1ApR1Cv9nb0CA5xlpaOgUhlsaPlW8EDeyuEIQGsht7RyGFPgpWsUlrAOiytbhAWsj07DksgaqgK5AAiIgCIiAIiIAiIgCIiAIodpe+W2Uckji574I3OcTzJaFMQBERAEREBQhYy1ZVjmkbDE+WTZjGlzj5BAW6Smk9lAjvlC+SWN0pY5jsDIPvDSHZHlgqyPiG3vDC6R0Wtoc3xWFuoEZ29BzQGy0nsgaoRvVEHMGqT3iR/TdscA49TkYRl5opaiCGKQvM+oRuA2cRzA7nnntgoCeG4V+Fr5LxQxZ8SfADtOdJxnOOeO4I9VlprhTVTQ6CTILtAyCN8ZQExFq3XcBzAyjqn6nvZ8jcFuc5y4bbc/MLGb/Ssh8SZk8OQwtbIGgu1AkY3wcAHKA3CLVNvcEgYYIp5g9zmtLANyMnqeRAyDywR3Ctpr/SVIaYhM4OdGPhGxftvv0OAfM43QG3REQBERAEREAREQEKy/8A49B/60f/AMhTURAEREAREQBWyND2OY4Za4YKIgIX3VQFrc0sfunI28sfsn3XRBoxTtGG4GCeWOXp5enYKqIA+30cjnufA1zjg5Oe2FRttoo9JZTMac5GnbSe47H90RAU+7KJztTqZhIcXb9+ef1JPqc81JggigaRDG1gJ30jn0VUQGFtDTNLwIgderVkk51Y1c++FT2Omc9znwtcZAGu1EkYGcDHJEQGP7roWgvbTNad2+6SNs+vkMdsDCr910LC1rKZjRqHwkjGNxy89/NEQE8dPRVREAREQBERAEREB//Z' },
    { id: 9, name: 'Prawns Fry', price: 14.99, image: 'data:image/jpeg;base64,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' },
  ];
  
  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decoded.role);
    }
  }, []);

  const handleQuantityChange = (menuItem, quantity) => {
    setMenuItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [menuItem.id]: quantity,
    }));
  };

  const handleAddToCartWithQuantity = (menuItem) => {
    const quantity = menuItemQuantities[menuItem.id] || 1;
    for (let i = 0; i < quantity; i++) {
      handleAddToCart(menuItem);
    }
  };

  const handleAddToCart = (menuItem) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((item) => item.id === menuItem.id);
      if (itemInCart) {
        return prevCart.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...menuItem, quantity: 1 }];
      }
    });
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCartPage = () => {
    setIsCartOpen(!isCartOpen);
  };

  const isCustomer = userRole != 'staff';

  return (
    <div className="menu-container">
      {isCartOpen ? (
        <CartPage
          cart={cart}
          setCart={setCart} 
          handleRemoveFromCart={handleRemoveFromCart}
          selectedTableId={selectedTableId}
          toggleCartPage={toggleCartPage}
        />
      ) : (
        <>
          {/* Show cart button only for customers */}
          {isCustomer && (
            <div className="cart-button" onClick={toggleCartPage}>
              <img 
                src="https://static.vecteezy.com/system/resources/previews/028/568/852/non_2x/shopping-cart-icon-web-store-shopping-cart-icon-internet-shop-buy-logo-symbol-sign-purchase-product-basket-illustration-vector.jpg"
                alt="Cart Icon" 
                className="cart-icon"
              />
              <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
          )}
          
          {/* Show search input only for customers */}
          {isCustomer && (
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="menu-search-input"
            />
          )}
          
          <h2>Menu</h2>
          <div className="menu-grid">
            {filteredMenuItems.map((menuItem) => (
              <div key={menuItem.id} className="menu-item">
                <img src={menuItem.image} alt={menuItem.name} />
                <h3>{menuItem.name}</h3>
                <p>Price: ${menuItem.price}</p>
                
                {/* Show quantity control and add to cart only for customers */}
                {isCustomer && (
                  <>
                    <div className="quantity-control">
                      <input
                        type="number"
                        className="quantity-input"
                        value={menuItemQuantities[menuItem.id] || 1}
                        onChange={(e) => handleQuantityChange(menuItem, parseInt(e.target.value))}
                      />
                    </div>
                    <button 
                      className="add-to-cart-button" 
                      onClick={() => handleAddToCartWithQuantity(menuItem)}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;