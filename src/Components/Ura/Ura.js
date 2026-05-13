import { useEffect, useState } from 'react'
import api from './Api'
import './App.css'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import GaugeComponent from "./GaugeComponent";

function Ura(props) {
  function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + parseInt(s); }
  const [notificacao, setNotificacao] = useState([])
  const [churn, setChurn] = useState([])
  const [tetochurn, setTetoChurn] = useState([])
  const [projecaochurn, setProjecaoChurn] = useState([])
  const [fila, setData] = useState([]);
  const [tmes, setData_tmes] = useState([]);
  const [tmas, setData_tmas] = useState([]);
  const [nivel, setData_nivel] = useState([]);
  const [abandonadas, setData_abandonadas] = useState([]);
  const [recebidas, setData_rescebidas] = useState([]);
  const [atendiadas, setData_atendidas] = useState([]);
  const [logados, setLogados] = useState([]);
  const [melhorAgente, setMelhorAgente] = useState([]);

  var inicio = 0;

  if (notificacao.length == 0 && inicio == 0) {
    inicio = 1;
    getNotificacao();
  }
  
  // Busca as notificações novas no sitema a cada 3 minutos
  useEffect(() => { setInterval(setInterval(getNotificacao, 18000))}, [])
  // Busca as notificações de parada. Retorna um array
  function getNotificacao() {
    fetch('http://200.229.156.16:3001/db')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setNotificacao(data);
      });
      
  }

   // Busca as notificações novas no sitema a cada 3 minutos
  useEffect(() => { setInterval(setInterval(getChurn, 18000))}, [])
  // Busca as notificações de parada. Retorna um array
  function getChurn() {
    fetch('http://200.229.156.16:3001/churn')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setChurn(data[0].churn);
        setTetoChurn(data[0].churn_relativo);
        setProjecaoChurn(data[0].projecao_churn);
      });
      
  }
  //Busca a fila de atendimento na API. Retorna um array de objetos.
  const fetchMyAPI = async () => {
    var response = await api.get("../monitor/calls_in_queue");
    if (Array.isArray(response.data.result))
    {
      console.log(response.data.result)
      setData(response.data.result)
    }
    else
    {
      setData(fila)
    }
  }
  fila.sort(function (x,y){
    if(x.wait > y.wait){return -1;}
    else {return true;}
  });

  const filal = fila.slice(0,5)
  //Altera o estado da fila, para o tempo de espera do assinante a cada 1 segundo
  useEffect(() => { setInterval(fetchMyAPI, 5000) }, [])
  //console.log(fmtMSS(fila.wait))>
  ////// A partir daqui busca os dados de chamada da URA
  //Busca os dados de chamada recebidas, retorna um valor inteiro

  const fetchMyAPI_rescebidas = async () => {
    var response = await api.get("../dashboard/supervisor");
    const recebidasAtendimento = response.data.result.stats.stats_all.queues.Atendimento.counts.incoming.start_of_this.day
    const recebidasSuporte = response.data.result.stats.stats_all.queues.Suporte.counts.incoming.start_of_this.day
    // const recebidasSuporte
    const recebidasComercial = response.data.result.stats.stats_all.queues.Comercial.counts.incoming.start_of_this.day
    const recebidasTransbAtendComercial= response.data.result.stats.stats_all.queues.TransbordoAtendComercial.counts.incoming.start_of_this.day
    setData_rescebidas(recebidasAtendimento+recebidasSuporte+recebidasComercial+recebidasTransbAtendComercial);
  }
  useEffect(() => { setInterval(fetchMyAPI_rescebidas, 40000) }, [])

  const fetchMyAPI_atendidas = async () => {
    var response = await api.get("../dashboard/supervisor");

    const atendidasAtendimento = response.data.result.stats.stats_all.queues.Atendimento.counts.incoming_answer.start_of_this.day
    const atendidasSuporte = response.data.result.stats.stats_all.queues.Suporte.counts.incoming_answer.start_of_this.day
    const atendidasComercial = response.data.result.stats.stats_all.queues.Comercial.counts.incoming_answer.start_of_this.day
    const atendidasTransbAtendComercial = response.data.result.stats.stats_all.queues.TransbordoAtendComercial.counts.incoming_answer.start_of_this.day

    setData_atendidas(atendidasAtendimento+atendidasSuporte+atendidasComercial+atendidasTransbAtendComercial);
  }
  useEffect(() => { setInterval(fetchMyAPI_atendidas, 40000) }, [])

 const fetchMyAPI_abandonadas = async () => {
    var response = await api.get("../dashboard/supervisor");


    const abandonadasAtendimento = response.data.result.stats.stats_all.queues.Atendimento.counts.incoming_lost.start_of_this.day
    const abandonadasSuporte = response.data.result.stats.stats_all.queues.Suporte.counts.incoming_lost.start_of_this.day
    const abandonadasComercial = response.data.result.stats.stats_all.queues.Comercial.counts.incoming_lost.start_of_this.day
    const abandonadasTransbAtendComercial = response.data.result.stats.stats_all.queues.TransbordoAtendComercial.counts.incoming_lost.start_of_this.day


    setData_abandonadas(abandonadasAtendimento+abandonadasSuporte+abandonadasComercial+abandonadasTransbAtendComercial);
  }
  useEffect(() => { setInterval(fetchMyAPI_abandonadas, 40000) }, [])
  ////// A partir daqui busca os indicadores de desempenho da URA

  //Busca o tempo médio de espera na API. Retorna uma média de valores
  const fetchMyAPI_tmes = async () => {
    var response = await api.get("../monitor/stats_summary");
    const tmeatendimento =  response.data.result.queues.Atendimento.avgs.wait_time.start_of_this.day.avg
    const tmesuporte = response.data.result.queues.Suporte.avgs.wait_time.start_of_this.day.avg
    const tmecomercial =  response.data.result.queues.Comercial.avgs.wait_time.start_of_this.day.avg
    const tmetransbatendcomercial = response.data.result.queues.TransbordoAtendComercial.avgs.wait_time.start_of_this.day.avg

    setData_tmes((parseFloat(tmesuporte)+parseFloat(tmeatendimento)+parseFloat(tmecomercial)+parseFloat(tmetransbatendcomercial)).toFixed(2)/4)
  }
  useEffect(() => { setInterval(fetchMyAPI_tmes, 40000) }, [])
 //console.log(tmes)

  //Busca o tempo médio de atendimento na API. Retorna uma média de valores
  const fetchMyAPI_tmas = async () => {
    var response = await api.get("../monitor/stats_summary");
    setData_tmas(response.data.result.stats.avgs.talk_time.start_of_this.day.avg);
  }
  useEffect(() => { setInterval(fetchMyAPI_tmas, 40000) }, [])

  //Busca o nível de serviço na API. Retorna o nível de serviço em porcentagem
  const fetchMyAPI_nivel = async () => {
    var response = await api.get("../monitor/stats_summary");

    const nivelAtendimento = response.data.result.queues.Atendimento.service_levels.start_of_this.day
    const nivelSuporte = response.data.result.queues.Suporte.service_levels.start_of_this.day
    const nivelComercial = response.data.result.queues.Comercial.service_levels.start_of_this.day
    const nivelTransbordoAtendComercial = response.data.result.queues.TransbordoAtendComercial.service_levels.start_of_this.day

    setData_nivel(((parseFloat(nivelAtendimento)+parseFloat(nivelSuporte)+parseFloat(nivelComercial)+parseFloat(nivelTransbordoAtendComercial))).toFixed(2)/4);
  }

  useEffect(() => { setInterval(fetchMyAPI_nivel, 40000) }, [])
  //console.log(nivel)

  //Busca os agentes logados na API. Retorna um array.

     const fetchMyAPI_logados = async () => {
      var response = await api.get("../monitor/extens");
      setLogados(response.data.result);
    }
    useEffect(() => { setInterval(fetchMyAPI_logados, 5000) }, [])


    //Esta função serve para convertar os milissegundos do updated_at do agente e subtrair com a data atual e com isso retorna a diferença em mm:ss dos dois
    function converterMilissegundos(milissegundos) {
        const data = new Date(milissegundos);

        const dataDiferenca = new Date(new Date() - data)
        const minutosDiferenca = dataDiferenca.getMinutes();
        const segundosDiferenca = dataDiferenca.getSeconds();

      
        const minutosFormatados = (minutosDiferenca < 10) ? ('0' + minutosDiferenca) : minutosDiferenca;
        const segundosFormatados = (segundosDiferenca < 10) ? ('0' + segundosDiferenca) : segundosDiferenca;


        const horaDiferenca = (dataDiferenca.getHours() - 21)

        let tempo;

        if(horaDiferenca >=1){
          tempo =  '0'+ horaDiferenca + ':' + minutosFormatados + ':' + segundosFormatados;
        }else{
          tempo = minutosFormatados + ':' + segundosFormatados;
        }
        return tempo;
    }

    // ---------------------------------------------------------------------


    const ramaisValidos = [
      // COMERCIAL
      "4001","4002","4003","4004","4005","4006",

      // SUCESSO
      "8002","8003","8005","1038","3001",

      // SUPORTE
      "1020","1021","1022","1023",

      // ATENDIMENTO
      "3001","3002","3003","3004","3005","3006","3007","3008","3009","3010",
      "1044","1064","1065"
    ];
    
    const atendentes = logados.filter(value =>
      ramaisValidos.includes(value.exten) &&
      value.device_status === "registered"
    );


    // Resgata os agentes que estão pausados e de resto os que estão disponiveis, ordenado de pausado, em ligação e disponivel
    const agentes = atendentes
    .filter(a => a.agent?.name !== undefined)
    .sort(function(a, b) {
      if (a.is_paused === b.is_paused) {
        if (a.status === 'incall' && b.status !== 'incall') {
          return -1;
        } else if (b.status === 'incall' && a.status !== 'incall') {
          return 1;
        } else {
          return a.updated_at - b.updated_at;
        }
      } else if (a.is_paused === true) {
        return -1;
      } else {
        return 1;
      }
    })
    .map((agente, index, array) => {
      if (index === array.findIndex(a => a.is_paused === agente.is_paused && a.status === agente.status)) {
        const agentesMesmoStatus = array.filter(a => a.is_paused === agente.is_paused && a.status === agente.status);
        agentesMesmoStatus.sort((a, b) => a.updated_at - b.updated_at);
        return agentesMesmoStatus;
      }
      return null;
    })
    .flat()
    .filter(a => a !== null)
    

      const atendentesPausadosDisponiveis = agentes.slice(0, 10);

      const primeiros5 = atendentesPausadosDisponiveis.slice(0, 5);
      const ultimos5 = atendentesPausadosDisponiveis.slice(5, 10);

      const emLinha = agentes.filter(
        function(value) {
          return value.status === "incall"
        });

      const Ociosos = agentes.filter(
        function(value) {
          return value.status === "available" && value.is_paused == false
        }
      );

      const Pausados = agentes.filter(
        function(value) {
          return value.is_paused === true
        });   
      
      // console.log('---- inicio requisição ----')
      // console.log(new Date)
      // console.log(atendentesPausadosDisponiveis)
      // console.log('---- fim requisição ----')

      const fetchMyAPI_melhorAgente = async ()=> {
        var response = await api.get("../dashboard/agents");
        console.log(response.data.result.inquiry.best.agent.by_agent_rate.name)
        setMelhorAgente(response.data.result.inquiry.best.agent.by_agent_rate?.name)
      }
      useEffect(() => { setInterval(fetchMyAPI_melhorAgente, 40000) }, [])

  return (
<>

<body className='body-color-ura' style={{height: props.height, width:props.width, fontSize: props.height*0.052, margin: 0 }}>

  <div style={{display: 'flex', flexWrap:'wrap', flexDirection: 'column'}}>

  <div className='Fila' style={{width:props.width*0.1828125,height:props.height*0.96, fontSize: props.height*0.03, margin: props.height*0.007291667, marginLeft: props.height*0.02, marginTop: props.height*0.02}}>
      <h1 style={{fontSize: props.height*0.05, color: "#F3F3F3", fontWeight:400, marginTop: props.height*0.05}}>Fila URA: {fila.length}</h1>

    <ul style= {{padding: props.height*0.009259259, margin: 0, marginTop: props.height*0.020}}>
          {filal.map(filal => ( 
            <li style= {{backgroundColor: '#406381', borderRadius: props.height*0.025, margin: props.height*0.009259259, listStyle:'none', marginBottom: props.height*0.035, 
            width: props.width*0.165, height: props.height*0.131, alignItems:'center', paddingTop: props.width*0.007, lineHeight:props.height*0.0001}} key={filal.linkdid} className='row'>
                <h4 style={{font: 'Inter', fontSize: props.width*0.015, color: '#423D3E', borderRadius: props.height * 0.015, marginTop: props.height * -0.035, paddingTop: props.height*0.005, paddingBottom: props.height*0.005}}>{filal.queue.slice(0,15)}</h4>
                <h4 style={{font: 'Inter', fontSize: props.width*0.012, fontWeight: 'bold', color: '#F5F5F5', marginBottom: props.height*0.008 }}>{filal.src}</h4>
                <h4 style={{font: 'Inter', fontSize: props.width*0.019, color: '#423D3E', color: '#F5F5F5' }}>{fmtMSS(filal.wait)}</h4>
            </li> 
          ))} 
    </ul>
  </div>

{/* <div className='notify' style={{width: props.width*0.76, height: props.height*0.20, marginTop: props.height*0.02, marginLeft: props.height*0.04, display: 'flex', borderRadius: props.height*0.025}}>
    {notificacao.length > 0 ? (
      <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} showIndicators={false} interval={15000} showStatus={false} showArrows={false} width={props.width*0.76}>
        {notificacao.map(notificacao => (
          <text style={{marginTop: props.height*0.02, display: "block", fontSize: props.height*0.045}} key={notificacao.id_atendimento}>{notificacao.descricao_abertura}</text>
          ))}
        </Carousel>) : <text style={{fontsSize: props.height*0.24}}>Nenhuma notificação</text>}
  </div> */}

  

<div style={{width: props.width*0.76, height: props.height*0.20, marginTop: props.height*0.02, marginLeft: props.height*0.04, display: 'flex', borderRadius: props.height*0.025, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>

  {/* Logo centralizada */}
  <img src="/LogoEmex.png" alt="Logo" style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: props.width * 0.25, height: 'auto', paddingBottom: props.height*0.01 }}/>



  {/* Gauge alinhado à direita */}
  {props.width > 0 && props.height > 0 && churn > 0 && tetochurn > 0 && (
    <div style={{position: 'absolute', right: '-15px'}}>
      <GaugeComponent width={props.width} height={props.height} min={0} mid={(Math.round(parseFloat(tetochurn) * 0.5154 * 100) / 100).toFixed(2)} max={parseFloat(tetochurn)} aftermax={(Math.round(parseFloat(tetochurn) * 1.2371 * 100) / 100).toFixed(2)} churn_projetado={parseFloat(projecaochurn)} value={parseFloat(churn)} />
    </div>
  )}

</div>



    <div className='Indicadores' style={{width: props.width*0.7609375, height: props.height*0.150}}>
      <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true} interval={15000} showIndicators={false} showArrows={false} width={props.width*0.80} showStatus={false} transitionTime={500}>
      <div className='Dash1' style={{display: 'flex', gap: props.width*0.027, alignItems: 'center', textAlign: 'center', justifyContent: 'center', paddingTop: props.height*0.037037037}}>
        
          <div className='Indi' style={{ borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#CF721B"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#fff",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>TMA</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{fmtMSS(tmas)}</div>
          </div>

         <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#588D3A"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>TME</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{fmtMSS(tmes)}</div>
          </div>

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Melhor avaliação</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{melhorAgente ? melhorAgente.slice(0, 13) : ""}</div>
          </div>

          
      </div>

      <div className='Dash2' style={{display: 'flex', flexWrap: 'wrap', gap: props.width*0.027, alignItems: 'center', textAlign: 'center', justifyContent: 'center', paddingTop: props.height*0.037037037}}>
        <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#CF721B"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Recebidas</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{recebidas}</div>
          </div> 

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#588D3A"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Nível serviço</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{nivel}%</div>
          </div> 

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#719EC6"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Agentes Online</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{agentes.length}</div>
          </div> 

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Em Linha</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{emLinha.length}</div>
          </div> 

      </div>



      <div className='Dash3' style={{display: 'flex', flexWrap: 'wrap', gap: props.width*0.027, alignItems: 'center', textAlign: 'center', justifyContent: 'center', paddingTop: props.height*0.037037037}}>

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#CF721B"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Disponíveis</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{Ociosos.length}</div>
          </div> 

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background: "#588D3A"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Pausados</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{Pausados.length}</div>
          </div>

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015, background:"#719EC6"}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Atendidas</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{atendiadas}</div>
          </div> 

          <div className='Indi' style={{borderRadius: props.height*0.025,width:props.width*0.170, height:props.height*0.12, padding: props.height*0.015}}>
            <div style={{borderRadius: props.height * 0.015, color: "#2B373F", background: "#FFF",width:props.width*0.15, position: "absolute", top: props.height*-0.015, fontSize: props.height*0.029, height:props.height*0.046}}>Abandonadas</div>
            <div style={{fontSize: props.height*0.0420, marginTop: props.height*0.028 }} >{abandonadas}</div>
          </div>  
        

      </div>
      </Carousel>
    </div>

    <div style={{ display: 'flex', gap: props.width * 0.02, marginLeft: props.height * 0.04, marginTop: props.height * 0.05 }}>

    {/* Primeiros 5 agentes */}
    <div className='container-agentes' style={{ width: props.width * 0.37, height: props.height * 0.56, borderRadius: props.height * 0.025, paddingTop: props.height * 0.036 }}>
      
      {primeiros5.map(atendente => (
        <div className='agente' key={atendente.exten} style={{ borderRadius: props.height * 0.025, fontSize: props.height * 0.03, height: props.height * 0.08, marginBottom: props.height * 0.02 }}>
            <div className='nome-ramal' style={{minWidth: props.width * 0.15, marginLeft: '10px'}} >
              <span style={{fontSize: props.height*0.023, textTransform: "uppercase"}} >{atendente.agent?.name}</span>
              {/* <span style={{fontSize: props.height*0.019}} >{atendente.exten}</span> */}
            </div>

            {atendente.is_paused ? (
              <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#ec2121", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                Pausado
              </div>
            ) : (
              atendente.status !== 'incall' ? (
                <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#588D3A", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                  Disponível
                </div>
              ) : (
                <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#CF721B", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                  Em ligação
                </div>
              )
            )}

            <div className='agente-tempo' style={{fontSize: props.height*0.034, minWidth: props.width * 0.10}}>
              {converterMilissegundos(atendente.updated_at)}
            </div>
        </div>
      ))}
    </div>

     {/* Ultimos 5 agentes */}
    <div className='container-agentes' style={{ width: props.width * 0.37, height: props.height * 0.56, borderRadius: props.height * 0.025, paddingTop: props.height * 0.036 }}>
      
      {ultimos5.map(atendente => (
        <div className='agente' key={atendente.exten} style={{ borderRadius: props.height * 0.025, fontSize: props.height * 0.03, height: props.height * 0.08, marginBottom: props.height * 0.02 }}>
            <div className='nome-ramal' style={{minWidth: props.width * 0.15, marginLeft: '10px'}} >
              <span style={{fontSize: props.height*0.023, textTransform: "uppercase"}} >{atendente.agent?.name}</span>
              {/* <span style={{fontSize: props.height*0.019}} >{atendente.exten}</span> */}
            </div>

            {atendente.is_paused ? (
              <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#ec2121", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                Pausado
              </div>
            ) : (
              atendente.status !== 'incall' ? (
                <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#588D3A", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                  Disponível
                </div>
              ) : (
                <div className='agente-status' style={{borderRadius: props.height*0.025, fontSize: props.height*0.020, height: props.height*0.05, minWidth: props.width*0.08, color: '#FFF', background: "#CF721B", marginRight: props.width*0.01, textTransform: "uppercase"}}>
                  Em ligação
                </div>
              )
            )}

            <div className='agente-tempo' style={{fontSize: props.height*0.034, minWidth: props.width * 0.10}}>
              {converterMilissegundos(atendente.updated_at)}
            </div>
        </div>
      ))}
    </div>

    </div>
    
    {/* <div className='Avalia' style={{width:width*0.759, height:width*0.125, marginLeft:width*0.024, marginTop:width*0.03 }}>
        <div className='AvaliaTitulo'>Melhores avaliações URA</div>
        <div className='Avaliacoes' style={{width:width*0.759, height:props.height*0.122, display:'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'space-around', }}>
          <div>
            Dyego
            <div>5,5</div>
          </div>
          
          <div>
            Pedro
            <div>5,5</div>
          </div>
          
          <div>
            Rafael
            <div>5,5</div>
          </div>
        </div>
    </div> */}

  </div>
  
</body>
</>
  )
}


export default Ura
