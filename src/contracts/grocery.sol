// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract Celogroceries {

    uint internal groceriesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Grocery {
        address payable owner;
        string name;
        string image;
        string description;
        string location;
        uint price;
        uint sold;
        bool soldout;
    }

    mapping (uint => Grocery) internal groceries;

    modifier onlyOwner(uint _index){
        require(groceries[_index].owner == msg.sender, "only the owner can call this function");
        _;
    }


/**
 addGrocery function will add a new grocery to the marketplace
 **/
    function addGrocery(
        string memory _name,
        string memory _image,
        string memory _description, 
        string memory _location, 
        uint _price
    ) public {
        uint _sold = 0;
        groceries[groceriesLength] = Grocery(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold,
            false
        );
        groceriesLength++;
    }

/**
 buyGrocery function will allow a user to buy a grocery using an index parameter
 **/
    function buyGrocery(uint _index) public payable  {
        require(msg.sender != groceries[_index].owner);
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            groceries[_index].owner,
            groceries[_index].price
          ),
          "Transfer failed."
        );
        groceries[_index].sold++;
    }

/**
 toggleSoldout will toggle a soldout boolean property of a listing
 **/
    function toggleSoldout(uint _index) external onlyOwner(_index){
        groceries[_index].soldout = !groceries[_index].soldout;
    }

     
     /**
 changePrice function will change the price of a listing
 **/
     function changePrice(uint _index, uint _newPrice) external onlyOwner(_index){
        groceries[_index].price = _newPrice;
     }

     /**
        deleteGroceryListing will delete a listing 
      **/
      function deleteGroceryListing(uint _index) external onlyOwner(_index){    
            groceries[_index] = groceries[groceriesLength - 1];
            delete groceries[groceriesLength - 1];
            groceriesLength--; 
	 }

     /**
     getGrocery function will get a grocery from the marketplace.
     **/
    function getGrocery(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint,
        bool
    ) {
         Grocery storage g = groceries[_index];
        return (
            g.owner,
            g.name, 
            g.image, 
            g.description, 
            g.location, 
            g.price,
            g.sold,
            g.soldout
        );
    }

    /**
 getGroceriesLength will return the length of groceries in the marketplace
 **/
    function getGroceriesLength() public view returns (uint) {
        return (groceriesLength);
    }
}