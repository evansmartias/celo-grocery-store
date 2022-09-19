// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Celogroceries {
    uint256 private groceriesLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Grocery {
        address payable owner;
        string name;
        string image;
        string description;
        string location;
        uint256 price;
        uint256 sold;
        bool soldout;
    }

    mapping(uint256 => Grocery) private groceries;

    modifier checkIfListingOnwer(uint256 _index) {
        require(
            groceries[_index].owner == msg.sender,
            "only the owner can call this function"
        );
        _;
    }

    /**
     * @dev addGrocery function will add a new grocery to the marketplace
     * @notice input data can't have empty values
     */
    function addGrocery(
        string calldata _name,
        string calldata _image,
        string calldata _description,
        string calldata _location,
        uint256 _price
    ) public {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_image).length > 0, "Empty image");
        require(bytes(_description).length > 0, "Empty description");
        require(bytes(_location).length > 0, "Empty location");
        uint256 _sold = 0;
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
     * @dev toggleSoldout will toggle a soldout boolean property of a listing
     * @notice This will toggle the soldout status to the opposite of its current state
     */
    function toggleSoldout(uint256 _index) public checkIfListingOnwer(_index) {
        Grocery storage grocery = groceries[_index];
        if (grocery.soldout == false) {
            grocery.soldout = true;
        } else {
            grocery.soldout = false;
        }
    }

    /**
     *@dev changePrice function will change the price of a listing
     */
    function changePrice(uint256 _index, uint256 _newPrice)
        external
        checkIfListingOnwer(_index)
    {
        groceries[_index].price = _newPrice;
    }

    /**
     * @dev deleteGroceryListing will delete a listing
     */
    function deleteGroceryListing(uint256 _index)
        public
        checkIfListingOnwer(_index)
    {
        uint256 newGroceriesLength = groceriesLength - 1;
        groceries[_index] = groceries[newGroceriesLength];
        delete groceries[newGroceriesLength];
        groceriesLength = newGroceriesLength;
    }

    /**
     * @dev getGrocery function will get a grocery from the marketplace.
     */
    function getGrocery(uint256 _index)
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            bool
        )
    {
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
     * @dev buyGrocery function will allow a user to buy a grocery using an index parameter
     */
    function buyGrocery(uint256 _index, uint8 amount) public payable {
        require(_index < groceriesLength, "Query of nonexistent grocery");
        Grocery storage currentGrocery = groceries[_index];
        require(!currentGrocery.soldout, "Product is current sold out");
        require(
            currentGrocery.owner != msg.sender,
            "You can't buy your own product"
        );
        require(amount >= 1, "At least one product needs to be bought");
        // only runs if grocery has a valid charging price
        if (currentGrocery.price > 0) {
            require(
                IERC20Token(cUsdTokenAddress).transferFrom(
                    msg.sender,
                    currentGrocery.owner,
                    currentGrocery.price * amount
                ),
                "Transfer failed."
            );
        }
        uint256 newSold = currentGrocery.sold + amount;
        currentGrocery.sold = newSold;
    }

    /**
     * @dev getGroceriesLength will return the length of groceries in the marketplace
     */
    function getGroceriesLength() public view returns (uint256) {
        return (groceriesLength);
    }
}
