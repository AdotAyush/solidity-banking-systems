pragma solidity ^0.8.20;

contract Bank {
    // Mapping to store user balances
    mapping(address => uint256) public balances;
    
    // Mapping to check if user is registered
    mapping(address => bool) public registeredUsers;
    
    // Address of the contract owner (admin)
    address public owner;
    
    // Events for tracking operations
    event UserRegistered(address indexed user, uint256 timestamp);
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);
    event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    
    // Modifier to check if user is registered
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    // Modifier to check if caller is owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerUser(address userAddress) external {
        require(!registeredUsers[userAddress], "User already registered");
        registeredUsers[userAddress] = true;
        emit UserRegistered(userAddress, block.timestamp);
    }
    
    function deposit() external payable onlyRegistered {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
    
    function withdraw(uint256 amount) external onlyRegistered {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdraw(msg.sender, amount, block.timestamp);
    }
    
    function transfer(address to, uint256 amount) external onlyRegistered {
        require(to != address(0), "Invalid recipient address");
        require(registeredUsers[to], "Recipient not registered");
        require(amount > 0, "Transfer amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount, block.timestamp);
    }
    
    function getBalance(address userAddress) external view returns (uint256) {
        return balances[userAddress];
    }
    
    function isRegistered(address userAddress) external view returns (bool) {
        return registeredUsers[userAddress];
    }
}

