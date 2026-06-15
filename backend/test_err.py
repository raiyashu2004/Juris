import asyncio
from routers.chat import generic_call, GenericChatRequest
import os

async def main():
    os.environ["GEMINI_API_KEY"] = "dummy"
    req = GenericChatRequest(system_prompt="sys", user_message="user")
    try:
        await generic_call(req)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
