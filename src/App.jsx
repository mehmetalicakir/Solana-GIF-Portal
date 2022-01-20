import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'immehmetali';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://media.giphy.com/media/k8kITi9SAwe9JWbUaH/giphy.gif',
  'https://media.giphy.com/media/l3vRgqJIdbRp7Exfa/giphy.gif',
  'https://media.giphy.com/media/MHboUUIoxzOKs/giphy.gif',
  'https://media.giphy.com/media/26gsvCk59AwGX28XS/giphy.gif',
  'https://media.giphy.com/media/RkDZq0dhhYHhxdFrJB/giphy.gif',
  'https://media.giphy.com/media/Basrh159dGwKY/giphy.gif'
]



const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        // Phantom Wallet connect check
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          //Check Logged In
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          // Set the user's publicKey in state to be used later!
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {  
    const { solana } = window;
    

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  } 
  
  };

// Gif Input Change
const onInputChange = (event) => {
const { value } = event.target;
setInputValue(value);};

// Send Function
const sendGif = async () => {
  if (inputValue.length > 0) {
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};


//Not Connect

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );





//Connect

  const renderConnectedContainer = () => (
  <div className="connected-container">
  <form
      onSubmit={(event) => {
      event.preventDefault();
      sendGif();
      }}
    >
      <input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange}/>
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);




  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);



  return (
    <div className="App">
      { /* This was solely added for some styling fanciness */}
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">GIF Portal</p>
          <p className="sub-text">
            View this GIF collection with your wallet ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* We just need to add the inverse here! */}
          {walletAddress && renderConnectedContainer()}

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <span className="footer-text"> built by  @<a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`${TWITTER_HANDLE}`}</a> with buildspace </span>
        </div>
      </div>
    </div>
  );
};

export default App;
