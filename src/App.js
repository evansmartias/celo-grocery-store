
import './App.css';
import Home from './components/home';
import { Ideas } from './components/showGroceries';
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import grocery from "./contracts/grocery.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;
const contractAddress = "0xbC7BdE71aeF4ee5eA9431E84FCbc0bF647301c9e";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [groceries, setGroceries] = useState([]);
  


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(grocery, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);



  const getGroceries = useCallback(async () => {
    const groceriesLength = await contract.methods.getGroceriesLength().call();
    const groceries = [];
    for (let index = 0; index < groceriesLength; index++) {
      let _groceries = new Promise(async (resolve, reject) => {
      let grocery = await contract.methods.getGrocery(index).call();

        resolve({
          index: index,
          owner: grocery[0],
          name: grocery[1],
          image: grocery[2],
          description: grocery[3],
          location: grocery[4],
          price: grocery[5],
          sold: grocery[6],
          soldout: grocery[7],
        });
      });
      groceries.push(_groceries);
    }


    const _groceries = await Promise.all(groceries);
    setGroceries(_groceries);
  }, [contract]);


  const addGrocery = async (
    _name,
    _image,
    _description,
    _location,
    _price,
 
  ) => {
    let price = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addGrocery(_name, _image, _description, _location, price)
        .send({ from: address });
      getGroceries();
    } catch (error) {
      alert(error);
    }
  };


  const modifyPrice = async (_index, _newPrice) => { 
    let price = new BigNumber(_newPrice).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods.changePrice(_index, price).send({ from: address });
      getGroceries();
      alert("you have successfully changed the price");
    } catch (error) {
      alert(error);
    }};

    
  const toggleSoldout = async (_index) => { 
    
    try {
      await contract.methods.toggleSoldout(_index).send({ from: address });
      getGroceries();
      alert("you have successfully toggled sold out");
    } catch (error) {
      alert(error);
    }};


  const deleteGrocery = async (
    _index
  ) => {
    try {
      await contract.methods
        .deleteGroceryListing(_index)
        .send({ from: address });
      getGroceries();
      alert("you have successfully deleted this grocery");
    } catch (error) {
      alert(error);
    }
  };


  const buy = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
        let ammount = groceries[_index].price;
      await cUSDContract.methods
        .approve(contractAddress, ammount)
        .send({ from: address });
      await contract.methods.buyGrocery(_index).send({ from: address });
      getGroceries();
      getBalance();
      alert("you have successfully bought a grocery");
    } catch (error) {
      alert(error);
    }};


  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getGroceries();
    }
  }, [contract, getGroceries]);
  
  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addGrocery={addGrocery} />
      <Ideas 
      groceries={groceries} 
      buy={buy} 
      walletAddress={address} 
      modifyPrice={modifyPrice}
      deleteGrocery={deleteGrocery}
      toggleSoldout={toggleSoldout}
      />
      
    </div>
  );
}

export default App;