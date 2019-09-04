import React, { Component } from 'react';
import { render } from 'react-dom';
import LineChart, { parseFlatArray } from 'react-linechart';


class Lines extends Component {
  constructor(props) {
    super(props);
  }
	render() {
    const gsmData = this.props.points
		const gsmFlat = parseFlatArray(gsmData, "x", ["y", "z"]);
    
		return (
			<div className="user-info">
      <h2>No of Comments & Posts over Years</h2>
      {/* <div className="card text-center">
					<LineChart 
						width={600}
						height={400}
            data={data}
            yLabel="#Comments"
            xLabel="Year"
					/>
				</div> */}
        
        <div className="card text-center">

				
					<LineChart 
						width={700}
						height={500}
            data={gsmFlat}
						yMean={0}
						yLabel="Number"
            xLabel="Year"
           
					/>
					<div ><p className="Xaxis">Blue = Comments</p><p>    </p><p className="Yaxis">Red = Posts</p></div>
				</div>
        	</div>
     
		);
	}
}

export default Lines;