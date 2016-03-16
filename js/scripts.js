//http://www.javascriptlint.com/online_lint.php
//Funcoes especificas do Phonegap
var celular_modelo = "";	
var celular_plataforma = "";
var celular_uuid = "";
var celular_versao = "";
var isPhoneGapReady = false;
var isConnected = false;
var isHighSpeed = false;
var tipo_conexao = "";
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var email_aplicativo;
var latitude = "";
var longitude = "";

function echeck(str) {
	var at="@";
	var dot=".";
	var lat=str.indexOf(at);
	var lstr=str.length;
	var ldot=str.indexOf(dot);
	if (str.indexOf(at)==-1){
	   //alert("Invalid E-mail ID");
	   return false;
	}

	if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
	   //alert("Invalid E-mail ID");
	   return false;
	}

	if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		//alert("Invalid E-mail ID");
		return false;
	}

	 if (str.indexOf(at,(lat+1))!=-1){
		//alert("Invalid E-mail ID");
		return false;
	 }

	 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		//alert("Invalid E-mail ID");
		return false;
	 }

	 if (str.indexOf(dot,(lat+2))==-1){
		//alert("Invalid E-mail ID");
		return false
	 }
	
	 if (str.indexOf(" ")!=-1){
		//alert("Invalid E-mail ID");
		return false;
	 }

	 return true;
}
	 
document.addEventListener("deviceready", onDeviceReady, false);
	 
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	isPhoneGapReady = true;
	// detect for network access
	networkDetection();
	// attach events for online and offline detection
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
			
	var conteudo = "";
	conteudo = conteudo + 'Modelo: '    + device.model    + '<br />';
	conteudo = conteudo + 'Plataforma: ' + device.platform + '<br />';
	conteudo = conteudo + 'UUID: '     + device.uuid     + '<br />';
	conteudo = conteudo + 'Versão: '  + device.version  + '<br />';
	conteudo = conteudo + 'Bateria: '  + status_bateria  + '<br />';
	conteudo = conteudo + 'Tipo de conexão: '  + tipo_conexao  + '<br />';
			
	celular_modelo = device.model;
	celular_plataforma = device.platform;
	celular_uuid = device.uuid;
	celular_versao = device.version;
	$("#deviceproperties").append(conteudo);
	
	
	
}


// alert dialog dismissed
function alertDismissed() {
	// do something
}

function AlertConfirmed(buttonIndex) {
	if (buttonIndex ==1){ //OK
		$('#content_news').text('Aguarde o seu dispositivo abrir a câmera para tirar a foto.');	
		if (isPhoneGapReady){
			if (isConnected) {
				capturePhoto();
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'Enviar Foto', 'OK');
				$.mobile.changePage("#main");
			}				
		} else {
			navigator.vibrate(2000);
			navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'Enviar Foto', 'OK');
			$.mobile.changePage("#main");
		}
	}
	if (buttonIndex ==2){ //Cancelar
		$.mobile.changePage("#pageone");
	}
}

function networkDetection() {
	if (isPhoneGapReady) {
		// as long as the connection type is not none,
		// the device should have Internet access
		var states = {};
		states[navigator.connection.UNKNOWN]  = 'Unknown connection';
		states[navigator.connection.ETHERNET] = 'Ethernet connection';
		states[navigator.connection.WIFI]     = 'WiFi connection';
		states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
		states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
		states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
		states[navigator.connection.NONE]     = 'No network connection';
		tipo_conexao = states[navigator.connection.type];
				
		if (tipo_conexao != 'No network connection') {
			isConnected = true;
		}
		// determine whether this connection is high-speed
		if (tipo_conexao == 'Unknown connection' || tipo_conexao == 'Cell 2G connection') {
			isHighSpeed = false;
		} else {
			isHighSpeed = true;
		}

	}
}
		
function onOnline() {
	isConnected = true;
}

function onOffline() {
	isConnected = false;
}
		
	 
function clearCache() {
	    navigator.camera.cleanup();
}
	 
	var retries = 0;
	function onCapturePhoto(fileURI) {
	    var win = function (r) {
	        clearCache();
	        retries = 0;
	        //navigator.notification.alert('Concluido! A foto foi enviada para nosso servidor!', alertDismissed, 'Enviar Foto', 'OK');
			navigator.vibrate(2000);
			navigator.notification.confirm( 'Concluido! A foto foi enviada para nosso servidor! Deseja enviar outra foto?', AlertConfirmed, 'Enviar Foto', ['OK', 'SAIR']);
			//$.mobile.changePage("#main");
	    }
	 
	    var fail = function (error) {
	        if (retries == 0) {
	            retries ++
	            setTimeout(function() {
	                onCapturePhoto(fileURI)
	            }, 1000)
	        } else {
	            retries = 0;
	            clearCache();
	            navigator.notification.alert('Ocorreu um problema!', alertDismissed, 'Enviar Foto', 'OK');
				$.mobile.changePage("#main");
	        }
	    }
		
		
		$('#content_news').text('Aguarde, a foto está sendo enviada para o nosso servidor!');
	 
	    var options = new FileUploadOptions();
	    options.fileKey = "recFile";
	    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
	    options.mimeType = "image/jpeg";
		
		var params = new Object();
        params.email = email_aplicativo;
		//params.latitude = latitude;
		//params.longitude = longitude;
        
	    //options.params = {}; // if we need to send parameters to the server request
		options.params = params;
		
	    var ft = new FileTransfer();
	    ft.upload(fileURI, encodeURI("http://www.gotasdecidadania.com.br/novo/programado/upload_foto.php"), win, fail, options);
	}
	 
	function capturePhoto() {
	    navigator.camera.getPicture(onCapturePhoto, onFail, {
	        quality: 100,
	        destinationType: destinationType.FILE_URI
	    });
	}
	 
	function onFail(message) {
		navigator.vibrate(2000);
	    navigator.notification.alert('Ocorreu o seguinte erro: ' + message, alertDismissed, 'Enviar Foto', 'OK');
	}
	
	$(document).on('pageinit', '#pageone', function(){ 
		$(document).on('click', '#enviar_contato', function() { // catch the form's submit event
		
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}

			if (continuar){
				email_aplicativo = $('#email_contato').val();
				$.mobile.changePage("#foto");
			} else {
				alert(mensagem);
			}
			return false; // cancel original event to prevent form submitting
	 
		});
	});
	
	
	$(document).on('pageshow', '#foto', function(){
		if (isPhoneGapReady){
			if (isConnected) {
				//obter posicao
				var options = {
				maximumAge: 3000,
				timeout: 5000,
				enableHighAccuracy: true
				};
				navigator.geolocation.getCurrentPosition(ObterCoordenadas, geoError, options);
				
				
				capturePhoto();
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'Enviar Foto', 'OK');
				$.mobile.changePage("#main");
			}				
		} else {
			navigator.vibrate(2000);
			navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'Enviar Foto', 'OK');
			$.mobile.changePage("#main");
		}
	});
	
	//Retornar coordenadas
	function ObterCoordenadas(position) {
		latitude = position.coords.latitude
		longitude = position.coords.longitude;
	}
		
	function geoError(error) {
		//Nao fazer nada, as coordenadas sao opcionais
		//alert('codigo: ' + error.code + '\n' + 'mensagem: ' + error.message + '\n');
	}
	