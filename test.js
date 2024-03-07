'use strict';
const b2CloudStorage = require('b2-cloud-storage');
const fs = require('fs');
const { isDataView } = require('util/types');


const b2 = new b2CloudStorage({
	auth: {
		accountId: '00576cfdca7de560000000001', // NOTE: This is the accountId unique to the key
		applicationKey: 'K0050TbY+RUsURdBAx8hk2abJ0MIRBM'
	}
});

// b2.authorize(function(err) {
// 	if(err){ throw err; }
// 	// this function wraps both a normal upload AND a large file upload
// 	b2.uploadFile('/Users/pratikkundnani/Desktop/Blog App/goku.jpeg', {
// 		bucketId: '47361cef3dbcfaa78dde0516',
// 		fileName: 'test.jpeg', // this is the object storage "key". Can include a full path
// 		contentType: 'application/zip',
// 		onUploadProgress: function(update){
// 			console.log(`Progress: ${update.percent}% (${update.bytesDispatched}/${update.bytesTotal}`);
// 			// output: Progress: 9% 9012/100024
// 		}
// 	}, function(err, results){
// 		// handle callback
// 		b2.getFileInfo(results.fileId, function(err, results) {
// 			if(err) {
// 				throw err;
// 			}
// 			console.log(JSON.stringify(results));
// 		});
//         console.log("Successsssss");
// 	});
// });

console.log('ok');

(async () => {
	function fileUpload(filePath, bucketId, fileName, contentType) {
		return new Promise((resolve, reject) => {
			b2.authorize(function(err) {
			  if(err){ reject(err); }
			  b2.uploadFile(filePath, {
				bucketId: bucketId,
				fileName: fileName,
				contentType: contentType,
				onUploadProgress: function(update){
				  console.log(`Progress: ${update.percent}% (${update.bytesDispatched}/${update.bytesTotal}`);
				}
			  }, function(err, results) {
				  if(err) {
					reject(err);
				  } else {
					resolve(results.fileId);
				  }
			  });
		  });
	
		});
	}
	
	const imgurl = await fileUpload('/Users/pratikkundnani/Desktop/Blog App/goku.jpeg', '47361cef3dbcfaa78dde0516', 'test.jpeg', 'application/zip');
	
	console.log(imgurl);
});

(function fileDownload() {
	b2.authorize(function(err) {
		if(err) { throw err; }
		b2.downloadFileById({
			fileId: '4_z47361cef3dbcfaa78dde0516_f112eb6569cb2175d_d20240306_m110806_c005_v0501017_t0006_u01709723286994',
		}, function(err, data) {
			if(err) { throw err; }
			
			// write a function to write the blob to the file system
			fs.writeFile('/Users/pratikkundnani/Desktop/Blog App/sep.txt', data,'binary' ,(err) => {
				if (err) {
				  console.error('Error writing file:', err);
				} else {
				  console.log('File written successfully');
				}
			  });
		});
	});
})();

console.log('ok2');