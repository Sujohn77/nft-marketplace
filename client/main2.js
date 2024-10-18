import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./contstant.js"

const connectButton = document.getElementById("connect_button")
const fundButton = document.getElementById("fund_button")
const balanceButton = document.getElementById("get_balance")
const withdrawButton = document.getElementById("withdraw_button")
async function connect() {
      console.log(typeof window.ethereum)
      if (typeof window.ethereum !== undefined) {
            const accounts = await window.ethereum.request({
                  method: "eth_requestAccounts",
            })
            console.log(accounts)
            connectButton.innerHTML = "Connected"
      } else {
            connectButton.innerHTML = "Please install metamask"
      }
}

async function fund() {
      const ethAmount = document.getElementById("fund").value.toString()
      if (typeof window.ethereum !== undefined) {
            try {
                  const provider = new ethers.providers.Web3Provider(
                        window.ethereum,
                  )
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(
                        contractAddress,
                        abi,
                        signer,
                  )
                  const transaction = await contract.fund({
                        value: ethers.utils.parseEther(ethAmount),
                  })
                  await addListenerOnTransaction(transaction, provider)
            } catch (err) {
                  console.log(err)
            }
      } else {
            document.getElementById("connect_button").innerHTML =
                  "Please install metamask"
      }
}

async function withdraw() {
      if (typeof window.ethereum !== undefined) {
            try {
                  const provider = new ethers.providers.Web3Provider(
                        window.ethereum,
                  )
                  const signer = provider.getSigner()
                  const contract = new ethers.Contract(
                        contractAddress,
                        abi,
                        signer,
                  )

                  const transaction = await contract.withdraw()
                  await addListenerOnWithdraw(transaction, provider)
                  document.getElementById("fund").value = "0.0"
            } catch (err) {
                  console.log(err)
            }
      } else {
            document.getElementById("connect_button").innerHTML =
                  "Please install metamask"
      }
}

async function getBalance(ethAmount = "0.5") {
      if (typeof window.ethereum !== undefined) {
            try {
                  const provider = new ethers.providers.Web3Provider(
                        window.ethereum,
                  )
                  const balance = await provider.getBalance(contractAddress)

                  document.getElementById("balance_status").innerHTML =
                        ethers.utils.formatEther(balance)
            } catch (err) {
                  console.log(err)
            }
      } else {
            document.getElementById("connect_button").innerHTML =
                  "Please install metamask"
      }
}

function addListenerOnTransaction(transactionResponse, provider) {
      console.log(`Mining transaction with ${transactionResponse.hash} hash`)
      return new Promise((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                  console.log(
                        `Completed with ${transactionReceipt.confirmations} confirmations`,
                  )
                  resolve()
            })
      })
}

function addListenerOnWithdraw(transactionResponse, provider) {
      console.log(`Mining transaction with ${transactionResponse.hash} hash`)
      return new Promise((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                  console.log(
                        `Completed with ${transactionReceipt.confirmations} confirmations`,
                  )
                  resolve()
            })
      })
}

connectButton.onclick = connect
fundButton.onclick = () => fund()
balanceButton.onclick = () => getBalance()
withdrawButton.onclick = () => withdraw()
