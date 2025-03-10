function App(){
    const { image_emoji, setImage_emoji, uploadResultMessage_emoji, sendImage_emoji } = Emoji();
    const { image_auth, setImage_auth, photoURL, setPhotoURL, authPhotoURL, uploadResultMessage_auth
        , isAuth, handleFileChange, sendImage_auth, sendImage_auth2 } = auth();
    const { isCameraOpen, videoRef, handleStartCamera, handleTakePhoto, handleCancel } = camera(setImage_emoji, setImage_auth, setPhotoURL);
    handlekeys();
    

    const displaycenter = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#FFFFFF'
    };

    const image_size = {
        maxWidth: '250px',
        maxHeight: '250px'
    };


    return (
        <div>

            {
                isCameraOpen && (
                    <div style={{...displaycenter, flexDirection: 'column'}}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '32%', height:'18%' }}></video>
                    <div>
                        <button onClick={handleTakePhoto}>Take Photo</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                    </div>
                )
            }
            <div style={{...displaycenter, alignItems: 'top'}}>
                <div>            
                    <div style={{textAlign:'center'}}>{uploadResultMessage_emoji}</div>
                    
                    <div>
                        <h3>Selected Photo</h3>
                        <img src={image_emoji instanceof Blob ? URL.createObjectURL(image_emoji) : image_emoji} alt="emoji" style={image_size}></img>   
                    </div>
                    
                    <div>
                        <input type="text" id="insert" style={{width: '300px', marginLeft: '0', marginBottom: '10px'}}></input>
                    </div>
                    
                    <form id="emojiform" style={{...displaycenter, marginTop:'10px'}} onSubmit={sendImage_emoji}>
                        <input className="other" type="file" name="image" accept='image/*' onChange={(e) => setImage_emoji(e.target.files[0])} />
                        <button className="other" type="submit">Emoji</button>
                        <button className="other" onClick={handleStartCamera}>Camera</button>
                    </form>
                </div>

                <div className="Auth">
                    <div style={{...displaycenter, flexDirection: 'column'}}>
                        <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage_auth}</div>        
                        
                        <div>
                            <h3>Selected Photo</h3>
                            <img src={photoURL || image_auth} alt="Captured" style={image_size}/>   
                        </div>

                        <div>
                            <h3>Latest Authenticated Photo</h3> 
                            {authPhotoURL && (
                                <img src={authPhotoURL} alt="Authenticated"  style={image_size}/>
                            )}
                        </div>
                        <form onSubmit={sendImage_auth} style={{...displaycenter, width: '450px'}}>
                            <input className="other" type='file' name='image' accept='image/*' onChange={handleFileChange} />
                            <button className="other" type='submit'>Auth</button>
                            <button className="other" onClick={handleStartCamera}>Camera</button>
                        </form>
                        <form onSubmit={sendImage_auth2}  style={{...displaycenter, width: '450px'}}>
                            <input type='text' id="first" name="first" placeholder="first"></input>
                            <input type='text' id="last" name="last" placeholder="last"></input>
                            <button type='submit'>Register</button>
                        </form> 
                    </div>
                </div>
            </div>
        </div>

    );
    
}     
        
ReactDOM.createRoot(document.getElementById('recog')).render(<App />);