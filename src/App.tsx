import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import {
  Container, Typography, Box, Link, AppBar, TextField, Button, Toolbar, Stack,
  Select,
  SelectChangeEvent, InputLabel, FormControl, MenuItem, Card, CardActions, CardContent, CardMedia, CircularProgress,
  Tab, Tabs
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios'

interface AnswerObj {
  context: Context
  answer: Answer
}

interface Context {
  title: string
  link: string
  text: string
}

interface Answer {
  score: number
  start: number
  end: number
  answer: string
}


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.cmu.ac.th/">
        Chiang Mai University
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {

  const [question, setQuestion] = useState<string>('Machine Learning คืออะไร');
  const [questionContext, setQuestionContext] = useState<string>('เกิดวันที่เท่าไร');
  const [context, setContext] = useState<string>(`พัทธ์ธีรา ศรุติพงศ์โภคิน (เกิด 3 ธันวาคม พ.ศ. 2533) หรือชื่อเล่นว่า อร เป็นนักแสดงหญิงชาวไทย สำเร็จมัธยมศึกษาจากCatholic Cathedral College ประเทศนิวซีแลนด์ และปริญญาตรีจากRaffles International College สาขา Business Marketing เข้าสู่วงการตั้งแต่อายุ 6 ขวบ จากการแสดงละครเวทีกับ ครูชลประคัลภ์ จันทร์เรือง จากนั้นก็เล่นโฆษณาในวัยเด็ก 2- 3 ชิ้น และยังเคยแสดงช่วงละครสั้น ในรายการซุปเปอร์จิ๋ว ประมาณปี 2542 ปัจจุบันเป็นทั้ง นักแสดง , พิธีกร และ วีเจ อยู่ที่คลื่น เก็ท 102.5 Bangkok International Hits Music Station และยังเป็นพิธีกรให้กับช่อง ทรู มิวสิก`);
  const [model, setModel] = useState<string>('xlm-roberta');
  const [answers, setAnswers] = useState<Array<AnswerObj>>([]);
  const [answerContext, setAnswerContext] = useState<Answer>();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleQuestionContextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionContext(event.target.value);
  };

  const handleContextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContext(event.target.value);
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
  };

  const handleGo2Click = async () => {
    const API_URL = "https://pirch-api.everythink.dev/qa-context/"
    setLoading(true)
    setAnswerContext(undefined)
    const res = await axios.post<Answer>(API_URL, { context: context, question: questionContext, model: model })
    setLoading(false)
    setAnswerContext(res.data)
  };

  const handleGoClick = async () => {
    const API_URL = "https://pirch-api.everythink.dev/qa/"
    setLoading(true)
    setAnswers([])
    const res = await axios.post<Array<AnswerObj>>(API_URL, { context: "", question: question, model: model })
    setLoading(false)
    setAnswers(res.data)
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Question Answering System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '80vh',
          }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="QA" {...a11yProps(0)} />
            <Tab label="QA-Context" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Stack spacing={2} direction="row">
              <TextField
                required
                id="questin-input"
                label="Question"
                value={question}
                onChange={handleQuestionChange}
                fullWidth
              />
              <FormControl sx={{ m: 1, minWidth: "15%" }} >
                <InputLabel id="qa-model">Model</InputLabel>
                <Select
                  labelId="qa-model"
                  id="qa-model-select"
                  value={model}
                  label="Model"
                  onChange={handleModelChange}
                >
                  <MenuItem value={"xlm-roberta"}>XLM-RoBERTa</MenuItem>
                  <MenuItem value={"wangchanberta"}>WangchanBERTa</MenuItem>
                  <MenuItem value={"bert"}>BERT</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleGoClick} disabled={loading}>GO</Button>
            </Stack>
            {loading && <Box sx={{ display: 'flex' }} alignItems="center" justifyContent="center" marginTop={4}> <CircularProgress /> </Box>}
            <Stack sx={{
              mt: 2,
            }} spacing={2}>
              {answers.map((answer, index) =>
              (
                <Card variant="outlined" key={index}>
                  <CardContent>
                    <Typography sx={{ mt: 1.5 }} color="text.secondary">
                      {answer.context.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {answer.answer.answer.replaceAll(".", "")}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Score : {answer.answer.score.toFixed(5)}
                    </Typography>
                    <Typography variant="body2">
                      {answer.context.text}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={answer.context.link + "#:~:text=" + answer.answer.answer.replaceAll(".", "")} target="_blank">Learn More</Button>
                  </CardActions>
                </Card>
              )
              )}
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Context"
              multiline
              rows={14}
              value={context}
              onChange={handleContextChange}
            />
            <Stack sx={{ mt: 2 }} spacing={2} direction="row">
              <TextField
                required
                id="questin-input"
                label="Question"
                value={questionContext}
                onChange={handleQuestionContextChange}
                fullWidth
              />
              <FormControl sx={{ mt: 1, minWidth: "15%" }} >
                <InputLabel id="qa-model">Model</InputLabel>
                <Select
                  labelId="qa-model"
                  id="qa-model-select"
                  value={model}
                  label="Model"
                  onChange={handleModelChange}
                >
                  <MenuItem value={"xlm-roberta"}>XLM-RoBERTa</MenuItem>
                  <MenuItem value={"wangchanberta"}>WangchanBERTa</MenuItem>
                  <MenuItem value={"bert"}>BERT</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleGo2Click} disabled={loading}>GO</Button>
            </Stack>
            {loading && <Box sx={{ display: 'flex' }} alignItems="center" justifyContent="center" marginTop={4}> <CircularProgress /> </Box>}
            {
              answerContext &&
              <Card variant="outlined" sx={{ marginTop: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Answer :  {answerContext.answer}
                  </Typography>
                  <Typography >
                    Score : {answerContext.score.toFixed(5)}
                  </Typography>
                  <Typography>
                    Start : {answerContext.start}
                  </Typography>
                  <Typography >
                    End : {answerContext.end}
                  </Typography>
                </CardContent>
              </Card>
            }
          </TabPanel>
        </Box>
      </Container>
      <Copyright />
    </>
  )
}

export default App
