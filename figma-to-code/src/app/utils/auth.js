import { auth } from "../firebase/firebase";

const signIn = () => auth.signInWithPopup(provider);
const signOut = () => auth.signOut();
const [user, setUser] = useState(null);

// listen for auth changes from Firebase
useEffect(() => {
  firebase.auth().onAuthStateChanged(async (user) => {
    setUser(user);
  });
}, []);
