var serverName = 'ec2-54-202-82-15.us-west-2.compute.amazonaws.com';

// Upload CSV file
function upload_csv_file()
{
	var blobFile = $('#file')[0].files[0];
	var formData = new FormData();
	formData.append("fileToUpload", blobFile);
	
	var url = "http://" + serverName + ":80/uploadCSVFile";
	$.ajax({
	  url: url,
	  type:'post',
	  processData: false,
	  contentType: false,
	  data: formData,
	  success: function(data) {
		document.getElementById('upload-div').innerHTML = "<h2>The CSV data has been successfully uploaded!</h2>";
	  },
	  error: function() {
		document.getElementById('upload-div').innerHTML = document.getElementById('').innerHTML + "<h2>Failed to upload the data!</h2>";
	  }
	});
}

// Upload CSV data directly
function upload_csv_data()
{
	var txt = document.getElementById('csv-text').value;
	txt = txt.replace(/\[/g, "(").replace(/\]/g, ")");
	
	var url = "http://" + serverName + ":80/uploadCSVData";
	$.ajax({
	  url: url,
	  type:'post',
	  data: txt ,
	  success: function(data) {
		document.getElementById('upload-div').innerHTML = "<h2>The CSV data has been successfully uploaded!</h2>";
	  },
	  error: function() {
		document.getElementById('upload-div').innerHTML = document.getElementById('').innerHTML + "<h2>Failed to upload the data!</h2>";
	  }
	});
}

// Search for an object
function search_in_db()
{
	var id = document.getElementById('object-id').value;
	var type = document.getElementById('object-type').value;
	var timestamp = document.getElementById('timestamp').value;
	
	var url = "http://" + serverName + ":80/search?id=" + id + "&type=" + type + "&timestamp=" + timestamp;
	$.ajax({
	  url: url,
	  type:'get',
	  success: function(data) {
	  
		if(data.output != "")
		{
			var tmp = data.output.substring(1, data.output.length-2);
			tmp = tmp.replace(/\'/g, "\"");
			tmp = tmp.replace(/\(/g, "\"\[");
			tmp = tmp.replace(/\)/g, "\]\"");
			
			var output = JSON.stringify(JSON.parse(tmp), null, 2);


			document.getElementById('object-status').innerHTML = "<br /> The object state is : <br /><textarea>" + output + " </textarea>";
		}
		else
		{
			document.getElementById('object-status').innerHTML = "<h4>The object does not exist at given timestamp</h3>";
		}
		//console.log(data);
	  },
	  error: function() {

	  }
	});
}
