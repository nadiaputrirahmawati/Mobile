

// untuk menangangi data binner pada api biasa nya di gunakan untuk mengirim atau menerima data dalam bentuk biner
// seperti menerima gambar dan file
import { Buffer } from 'buffer';

// variable client id dan secret menyimpan kode untuk konek ke api developer sportify
const client_id = 'c03384bcf03c4402959dc20c74849e2d';
const client_secret = 'b7322dbc67064f6ba33a663ee581d038';

// fungsi access token di sini untuk menerima client yang di deklarisak,, untuk asyns ini di gunakan untuk menerima data
// dari api untuk proses pengambilan data asnkron agar data lebih mudah di baca 
const getAccessToken = async () => {
// 
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  };

  try {
    //melakukan fech data
    const response = await fetch('https://accounts.spotify.com/api/token', options);
    // variable yang menyimpan data dalam bentuk json
    const data = await response.json();
    // mengembalikan acces token yang di terima oleh pengguna
    return data.access_token;
  } catch (error) {
    console.error('Error fetching saat menerima akses token ', error);
    throw error;
  }
};

export { getAccessToken };
